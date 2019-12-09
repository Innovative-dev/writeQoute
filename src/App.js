import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './navigation/header';
import Home from './components/home/home';
import Login from './components/auth/login';
import Registration from './components/auth/registration';

import AddPost from './components/posts/add-post/AddPost';
import NotFoundPage from './components/helper/notfound';
import firebase from './firebase';
import './App.scss';

// import AppTest from './AppTest'


class App extends Component {
  state = {
    authenticated: false,
    userinfo:null
  };
  componentDidMount() {
    
    firebase.auth().onAuthStateChanged((authenticated) => {
      if(authenticated){
        this.setState({authenticated: true});
        let authToken =firebase.auth().currentUser.uid;
        if (authToken) {
          console.log("authToken"+authToken);
          let userinfo = null;
          firebase.database().ref(`users/${authToken}`).once("value", snapchat => {
            userinfo = snapchat.val();
            userinfo.userId=authToken;
          }).then( () => {
            this.setState({ userinfo: userinfo});
          })
        }
      } else {
        this.setState({authenticated: false});
      }
    });
  }
  render() {
    return (
      // <AppTest />
      <BrowserRouter>
        <Header  authenticated = {this.state.authenticated} userInfo={this.state.userinfo}/>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/home' 
          render={(props) => <Home {...props} userInfo={this.state.userinfo} />}
        />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Registration} />
        <Route exact path='/add-qoute' 
          render={(props) => <AddPost {...props} userInfo={this.state.userinfo} />}
         />
         <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter> 
    );
  }
 }
 export default App;