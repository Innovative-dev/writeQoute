import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import firebase from './helper/firebase/firebase'; 
import Header from './pages/header/header';
import Home from './pages/home/home';
import Profile from './pages/profile/profile'
import Login from './pages/auth/index';
import AddPost from './pages/add-post/add-post';
import NotFoundPage from './helper/NotFoundPage';


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      authenticated: false,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      console.log("onAuthStateChanged is called ");
      if(authenticated){
        this.setState({authenticated: true});
      } else {
        this.setState({authenticated: false,});
      }
    });
  }
  render() {
    const { authenticated} = this.state;
    return (
      <BrowserRouter>
        <Header authenticated = {authenticated}/>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/home'   component={Home}/>
        <Route exact path='/login' component={Login} />
        <Route exact path='/add-new-qoute'  component={AddPost} />
         <Route exact path='/profile'  component={Profile} />
         <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter> 
    );
  }
 }


export default App;
