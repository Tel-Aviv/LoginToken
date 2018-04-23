import Otp from './components/Otp.jsx';
import Sms from './components/Sms.jsx';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { _ } from 'underscore';



 const INITIAL_STATE = {
     personalId: '',
     phone: ''
  };

const update = (state, mutations) =>
        _.assign({}, state, mutations);

const reducer = (state = INITIAL_STATE, action ) => {

    switch( action.type ) {

    case 'PID_CHANGED' :
        state = update(state, {personalId: action.data} );
        break;

    case 'PHONE_CHANGED':
        state = update(state, {phone: action.data});
        break;

    default:
        return state;
    }

    return state;

};

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDom.render(<Provider store={store}>
                    <Router>
                      <Switch>
                        <Route exact path="/" component={Sms}/>
                        <Route path="/otp" component={Otp}/>
                      </Switch>
                    </Router>
                </Provider>,
                  document.getElementById('container'));
