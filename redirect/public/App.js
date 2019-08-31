import React,{Component} from 'react';

import { BrowserRouter,Route, Switch } from 'react-router-dom'
import Test from './components/test'
import Home from './components/home'

class App extends Component {
  
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route
          exact path = '/login'
          component={Test}
          />
          <Route
          exact path = '/'
          component={Home}
          />
          <Route component={Test}/>
        </Switch>
        </BrowserRouter>
    );
  }
  
}

export default App;
