import React from 'react';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
const logOutUser = (history) => {
 firebase.auth().signOut();
 localStorage.removeItem("Authtoken");
 history.push('/login');
};
const LogOut = ({history}) => {
 return <a className="dropdown-item" onClick={()=>logOutUser(history)} children="Log Out" ></a>;
};
export default withRouter(LogOut);