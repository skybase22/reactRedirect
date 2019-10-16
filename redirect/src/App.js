import React, { Component } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './components/login'
import Home from './components/home'
import Edit from './components/edit'
import Add from './components/add'
import Detail from './components/detail'
import Printqrcode from './components/printqrcode'
import History from './components/history'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact path='/login'
            component={Login}
          />
          <Route
            exact path='/'
            component={Home}
          />
          <Route
            exact path='/edit'
            component={Edit}
          />
          <Route
            exact path='/add'
            component={Add}
          />

          <Route
            exact path='/detail'
            component={Detail}
          />

          <Route
            exact path='/printqrcode'
            component={Printqrcode}
          />

          <Route
            exact path='/history'
            component={History}
          />

        </Switch>
      </BrowserRouter>
    );
  }

}

export default App;
