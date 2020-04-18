import React from 'react';
import { FormGroup, InputGroup, Card, Elevation, } from "@blueprintjs/core";
import logo from "../../assets/img/open-book.png";

const LoginForm = (props)=> {
  let { email,password,handleInputChange,showPassword,
      loading,doSignInWithScial,handleSubmit,lockButton,gotToRegistration,error} =props;
  return(
    <main className="login-page">
      
      <div className=" v-h100 d-flex content-center items-center">
        <div className="col-md-6 col-lg-5">
          <Card className="aside-profile" interactive={true} elevation={Elevation.ONE}>
            <h2 className="text-ingradient c-black text-center">LOG-IN</h2>
            <div className="logo-wrapper m-auto">
              <h6>WriteQoute</h6>
              <div className="right-img">
                <img src={logo} />
              </div>
            </div>
            <br/>
            <h4 className="text-ingradient c-black text-center">Log in and write your thoughts...</h4>
            <br/>
            <button className="main-button facebook w-100" type="button" id="facebookBtn" onClick={doSignInWithScial}> 
                Log-in with Facebook
            </button>
            <br/><br/>
            <button className="main-button google w-100" type="button" id="googleBtn" onClick={doSignInWithScial}> 
                Log-in with Google
            </button>
            <br/><br/>
          </Card>
        </div>
      </div>
    </main>
  );
}

  export default LoginForm;
