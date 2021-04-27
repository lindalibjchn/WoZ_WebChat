import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Chat from './components/Chat/Chat';
import Head from './components/Head/Head';
import Signup from './components/Signup/Signup';
import Logout from './components/Logout/Logout';
import WebRTC from './components/WebRTC/WebRTC';
import Informdoc from "./components/Informdoc/Informdoc";

import SignInJoin from './components/Signin/Signinjoin';

const App = () =>(
    //register all components
  <Router>
     <Head />
      <Route path = "/" exact component = {SignInJoin}/>
      <Route path="/Chat"  component = {Chat} />
      <Route path="/Signup" component = {Signup} />
      <Route path="/Logout" component = {Logout} />
      <Route path="/WebRTC" component={WebRTC} />
  </Router>
);

export default App;