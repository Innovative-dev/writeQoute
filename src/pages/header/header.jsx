import React from "react";
import { Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { withRouter } from "react-router-dom";
import logo from "../../assets/img/open-book.png";
import firebase from '../../helper/firebase/firebase'

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      authToken:null,
      userInfo: {}
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      if(authenticated){
        this.setState({authenticated: true});
        let authToken =firebase.auth().currentUser.uid;
        if (authToken) {
          this.setState({ authToken: authToken});
          this.getUserInfo(authToken);
        }
      } else {
        this.setState({authenticated: false});
      }
    });
  }
  getUserInfo(uid){
    firebase.database().ref(`users/${uid}`).once("value").then(data => {
          this.setState({userInfo: data.val()})
      })
  }
  goToLogin = () => {
    this.props.history.push("/login");
  };
  goToAddPost = () => {
    this.props.history.push("/add-new-qoute");
  };
  goToProfile = () => {
    this.props.history.push("/profile");
  };
  goToHome = () => {
    this.props.history.push("/home");
  };

  goToLogout = () => {
    firebase.auth().signOut().then( () => {
      alert("Logout successfully done!");
      this.props.history.push("/home");
      this.setState({authToken: null,userInfo:{}})
    }).catch(()=>{
      alert('Some Error Occured !')
    })
  };

  render() {
    const { authToken,userInfo }  = this.state;

    const profileMenu = (
      <Menu>
        {authToken ?
        <div>
        <MenuItem icon="person" text={userInfo?.username} onClick={this.goToProfile} />
        <MenuItem icon="log-out" text="Log-out" onClick={this.goToLogout} />
        </div>
        : 
        <MenuItem icon="log-in" text="Log-in" onClick={this.goToLogin} />
        }
      </Menu>
    );
    
    return (
      
      <nav className="bp3-navbar .modifier">
        <div className="container">
          <div className="bp3-navbar-group bp3-align-left">
            <button
              className="bp3-button bp3-minimal bp3-icon-home"
              onClick={this.goToHome}
            >
              <span>Home</span>
            </button>
            <span className="bp3-navbar-divider"></span>
            <button
              className="bp3-button bp3-minimal bp3-icon-add"
              onClick={this.goToAddPost}
            >
              <span>Add</span>
            </button>
            <span className="bp3-navbar-divider"></span>

            <Popover content={profileMenu} position={Position.AUTO}>
            {userInfo?.photoURL ? (
              <img className="header-avatar  cursor-pointer" src={userInfo.photoURL} />
              ) : (
                <img className="header-avatar" src="./user.png" />
              )}
  
            </Popover>
            {/* <button className="bp3-button bp3-minimal bp3-icon-notifications"></button> */}
          </div>
          <div className="bp3-navbar-group bp3-align-right">
            {/* <input className="bp3-input" placeholder="Search files..." type="text" /> */}

            <div className="logo-wrapper">
              <h6>WriteQoute</h6>
              <div className="right-img">
                <img src={logo} />
              </div>
            </div>
          </div>
        </div>
        <span className="border-bottom"></span>
      </nav>
    );
  }
}
export default withRouter(Header);
