import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container,Card, Input, Button,Col } from 'reactstrap';
import firebase from '../../firebase';
class Registration extends Component {
 state = {
   email: '',
   password: '',
   error: null,
 };
handleInputChange = (event) => {
   this.setState({ [event.target.name]: event.target.value });
 };
handleSubmit = (event) => {
   event.preventDefault();
   const { email, password } = this.state;
firebase
     .auth()
     .createUserWithEmailAndPassword(email, password)
     .then((response) => {
       this.props.history.push('/home');
       localStorage.setItem("Authtoken",response.user.uid);
     })
     .catch((error) => {
       this.setState({ error: error });
     });
 };
 render() {
   const { email, password, error } = this.state;
   return (
    <Container>
         <div className="box-center pb-5">
             <br/><br/><br/><br/>
             <Col className="m-auto" md="6">
         <Card className="p-5">
           <h3 className="text-center mb-3">Registration</h3>
   
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
             <Button className="w-100" children="Log In" />
           </form>

       </Card>
       </Col>
       </div>
     </Container>
   );
 }
}
export default withRouter(Registration);