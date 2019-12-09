import React from 'react';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
const logOutUser = (props) => {
 firebase.auth().signOut();
 localStorage.removeItem("Authtoken");
 props.history.push('/login');
};
const LogOut = () => {
 return <a className="dropdown-item" onClick={logOutUser} children="Log Out" ></a>;
};
export default withRouter(LogOut);