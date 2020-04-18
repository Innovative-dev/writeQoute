import React from "react";
import { Intent, Button, Tooltip } from "@blueprintjs/core";
import { withRouter } from "react-router-dom";
import LoginForm from "./login";
import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
    this.githubAuthProvider = new app.auth.GithubAuthProvider();

    this.state = {
      showPassword: false,
      email: "",
      password: "",
      emailSignup: "",
      passwordSignup: "",
      username: "",
      mobileNo: "",
      error: "",
      loading: false,
      signupPage: false
    };
  }
  showPasswordToggle = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };

  users = () => this.db.ref("users");
  user = uid => this.db.ref(`users/${uid}`);

  handleInputChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        localStorage.setItem("Authtoken", response.user.uid);
        this.setState({ loading: false, error: "" });
        this.props.history.push("/home");
      })
      .catch(error => {
        alert("something went wrong !")
        this.setState({ error: error?.message, loading: false });
      });
  };
  doSignInWithScial = event => {
    event.preventDefault();

    console.log("doSignInWithScial called");
    let serviceProvider;
    this.setState({ loading: true });
    if (event.target.id === "googleBtn") {
       serviceProvider = this.googleProvider;
    } else if (event.target.id === "facebookBtn") {
       serviceProvider = this.facebookProvider;
    }
    this.auth
      .signInWithPopup(serviceProvider)
      .then(socialAuthUser => {
        console.log("socialAuthUser" + JSON.stringify(socialAuthUser));
        this.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          photoURL: socialAuthUser.user.photoURL,
          phoneNumber: socialAuthUser.user.phoneNumber,
          // createdAt:  socialAuthUser.user.createdAt,
        });
      })
      .then(() => {
        this.setState({ loading: false,error:"" });
        this.props.history.push("/home");
      })
      .catch(error => {
        this.setState({ error: error?.message, loading: false });
      });
  };
  gotToRegistration = () => {
    this.setState(prevState => ({
      signupPage: !prevState.signupPage
    }));
  };

  render() {
    const { showPassword, signupPage } = this.state;
    const lockButton = (
      <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
        <Button
          icon={showPassword ? "unlock" : "lock"}
          intent={Intent.Prim}
          minimal={true}
          onClick={this.showPasswordToggle}
        />
      </Tooltip>
    );
    return (
      <main>
      <LoginForm
      {...this.state}
      gotToRegistration={this.gotToRegistration}
      handleInputChange={this.handleInputChange}
      doSignInWithScial={this.doSignInWithScial}
      handleSubmit={this.handleSubmit}
      lockButton={lockButton}
    />
      </main>
    );
  }
}
export default withRouter(Login);
