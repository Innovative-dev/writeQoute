import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Card, Input, Button,Col } from 'reactstrap';
import firebase from '../../firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
class Login extends Component {

    constructor(props) {
      super(props);
      // app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.database();
      this.googleProvider = new app.auth.GoogleAuthProvider();
      this.facebookProvider = new app.auth.FacebookAuthProvider();
      this.twitterProvider = new app.auth.TwitterAuthProvider();
      this.githubAuthProvider = new app.auth.GithubAuthProvider();
      this.state = {
        email: '',
        password: '',
        error: null,
        loading: false,
      };
    }

  users = () => this.db.ref('users');
  user = uid => this.db.ref(`users/${uid}`);


handleInputChange = (event) => {
   this.setState({ [event.target.name]: event.target.value });
 };
handleSubmit = (event) => {
   event.preventDefault();
   this.setState({loading: true});
   const { email, password } = this.state;
    this.auth
     .signInWithEmailAndPassword(email, password)
     .then((response) => {
      localStorage.setItem("Authtoken",response.user.uid);
        this.setState({loading: false});
       this.props.history.push('/home');    
     })
     .catch((error) => {
       console.log("error"+JSON.stringify());
       this.setState({ error: error });
       this.setState({loading: false});
     });
 };
 
 doSignInWithScial = (event) => {
    event.preventDefault();
    // console.log(event.target.id);
   this.setState({loading: true});
   if(event.target.id === 'googleBtn'){
    var serviceProvider = this.googleProvider
   } else  if(event.target.id === 'facebookBtn'){
    var serviceProvider = this.facebookProvider
   } else  if(event.target.id === 'githubBtn'){
    var serviceProvider = this.githubAuthProvider
   }
    this.auth.signInWithPopup(serviceProvider)
    .then(socialAuthUser => {
      // console.log("socialAuthUser"+JSON.stringify(socialAuthUser));
      localStorage.setItem("Authtoken",socialAuthUser.user.uid);
      this.user(socialAuthUser.user.uid)
        .set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          photoURL: socialAuthUser.user.photoURL,
          phoneNumber: socialAuthUser.user.phoneNumber
        });
      })
    .then(() => {
      this.setState({loading: false});
      this.props.history.push('/home');
    })
    .catch(error => {
      this.setState({error: error});
      this.setState({loading: false});
    })
  }
  gotToRegistration(){
    this.props.history.push('/signup');
  }
 render() {
   const { email, password, error } = this.state;
   return (
     <Container>
         <div className="box-center pb-5">
             <br/><br/><br/><br/>
             <Col className="m-auto" md="6">
         <Card className="p-5">
           <h3 className="text-center mb-3">Log In</h3>
   
       {error ? (
             <h6>{error.message}</h6>
     
       ) : null}

           <form onSubmit={this.handleSubmit}>
             <Input className="w-100 mb-3" type="text" name="email" placeholder="Email" value={email} onChange={this.handleInputChange} />
             <Input  className="w-100 mb-3"
               type="password"
               name="password"
               placeholder="Password"
               value={password}
               onChange={this.handleInputChange}
             />
             <Button className="w-100">
                 {this.state.loading ? 'Please wait' : 'Log in'}
             </Button>
             <Button className="w-100 btn-danger  mt-3" id="googleBtn" onClick={this.doSignInWithScial}>
                 Login With Google
             </Button>
             <Button className="w-100 btn-info  mt-3" id="facebookBtn" onClick={this.doSignInWithScial}>
                 Login With Facebook
             </Button>
             <Button className="w-100 btn-dark  mt-3" id="githubBtn" onClick={this.doSignInWithScial}>
                 Login With Github
             </Button>
             <h6 className="text-center my-3">OR</h6>
             <Button className="w-100 btn-warning  mt-3" onClick={this.gotToRegistration.bind(this)}>
                 Manual Registeration
             </Button>
           </form>

       </Card>
       </Col>
       </div>
     </Container>
   );
 }
}
export default withRouter(Login);