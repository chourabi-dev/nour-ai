import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from 'react';
import SignINPage from './pages/Signin';
import DashboardPage from './pages/Dashboard'; 
import MeetNow from './pages/MeetNow';
import CondidaturesPage from './pages/CondidatesList';
import AddCondidate from './pages/AddCondidate';
import MeetResult from './pages/MeetResult';

class App extends React.Component{
  constructor(props){
    super(props);
  }


  render(){
    return (
      <Router>
        <Switch >
        <Route path="/" component= { SignINPage } exact />
        <Route path="/signin" component= { SignINPage } exact />
        <Route path="/home" component= { DashboardPage } exact />
        <Route path="/condidatures" component= { CondidaturesPage } exact />
        <Route path="/condidatures/add" component= { AddCondidate } exact />
        <Route path="/condidatures/meet-result/:id" component= { MeetResult } exact />
        
        
        

        

        <Route path="/meet/:id" component= { MeetNow } exact />
 

        
        

        
        
        
          
        </Switch>
      </Router>
    );
  }
}

export default App;
