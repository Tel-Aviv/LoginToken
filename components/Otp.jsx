import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom'




class Otp extends React.Component {

    constructor(props) {
        super(props);

        this.checkOtp = this.checkOtp.bind(this);
        this.otpChanged = this.otpChanged.bind(this);

        this.testMessage;

        this.state = {
            otp: '',
            message: '',
            loading: false,
            responseStatus: '',
            buttonDisabled: 'disabled'
        }

        this.styles = {

            initialStyle: {
                visibility: 'collapse'
            },
            messageStyle: {
                visibility: 'visible'
            }
        };

    };

    checkOtp(evt) {

        evt.preventDefault();

        this.setState({
            buttonDisabled: 'disabled',
            loading: true
        });
        axios.post('https://api.tel-aviv.gov.il/auth/api/token', {code: this.state.otp})
              .then(result => {
                  console.log('correct OTP');
                  if (result.data.error != null) {
                      this.setState({
                          responseStatus: "warning",
                          message: result.data.error
                      });
                  }
                  else {
                      this.setState({
                          responseStatus: "success",
                          message: "תהליך האימות הסתיים בהצלחה, התקבל טוקן."
                      });
                      setTimeout(500);
                      window.opener.postMessage(result.data,'*');
                  }
              })
              .catch(e => {

                  console.error(e.message);
                  this.setState({
                      responseStatus: "error",
                      message: e.message
                  });
              })
              .finally(() => {
                  this.setState({
                      loading: false,
                  });
              });
      };

    otpChanged(e) {

        this.setState({
            responseStatus: '',
            otp: e.target.value,
            buttonDisabled: ''
        });
    };



    componentWillMount() {
        if (this.props.personalId == '') {
            this.props.history.push("/");
        }
    }


    componentWillReceiveProps(nextProps) {
        // Received from Redux
        console.log('PID: ' + this.props.personalId);
    }

    render() {

        const alertClassNames = classNames('alert',
            { 'alert-success': this.state.responseStatus === 'success' },
            { 'alert-warning': this.state.responseStatus === 'warning' },
            { 'alert-danger': this.state.responseStatus === 'error' });

        const loaderClass = classNames('fa',
            { 'fa-spinner': this.state.loading },
            { 'fa-spin': this.state.loading });

        const currentStyle = (this.state.responseStatus != '') ? this.styles.messageStyle : this.styles.initialStyle;




        return (

            <div className="container">
                <form onSubmit={this.checkOtp}>
                    <div id="header">
                        <img className="img-responsive" src="https://ssop.tel-aviv.gov.il/adfs/portal/logo/logo.png?id=0B71356A5543693C0A85C7F7D64B538D7D31C575B4CDB4EF8F4F618C9C334B75" />
                    </div>
                    <div className="has-feedback">
                        <input type="number" className="form-control"
                            disabled value={this.props.personalId} />
                        <i className="form-control-feedback fa fa-user-o" aria-hidden="true" />
                    </div>
                    <br />
                    <div className="has-feedback">
                        <input type="number" className="form-control"
                            required='reqiured'
                            placeholder="קוד זמני" onChange={this.otpChanged} />
                        <i className="form-control-feedback fa fa-key" aria-hidden="true" />
                    </div>
                    <br />
                    <div className="row justify-content-md-center">
                        <div className="col col-md-1">
                            <button className="btn btn-primary btn-lg"
                                disabled={this.state.buttonDisabled}>
                                <span className="spanBtnText">שלח</span>
                                <span className="spinner"><i className={loaderClass}></i></span>
                            </button>
                        </div>
                    </div>
                    <br />
                    <div className={alertClassNames} role="alert" style={currentStyle}>
                        {this.state.message}
                    </div>
                    <div>
                        <span dir="ltr">? ההודעה לא התקבלה</span>
                        <Link to="/">
                            <div className="link">שליחה חוזרת</div>
                        </Link>
                    </div>
                </form>
            </div>);
    }
};
const mapStateToProps = state =>
{
    return {
        personalId: state.personalId
    }
};



export default withRouter(connect(mapStateToProps)(Otp));
