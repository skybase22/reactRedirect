import React,{Component} from 'react';

import { BrowserRouter,Route, Switch } from 'react-router-dom'
import Login from './components/login'
import Home from './components/home'

class App extends Component {
  
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route
          exact path = '/login'
          component={Login}
          />
          <Route
          exact path = '/'
          component={Home}
          />
          <Route/>
        </Switch>
        </BrowserRouter>
    );
  }
  
}

export default App;
