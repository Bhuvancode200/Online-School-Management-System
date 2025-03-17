/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useState} from "react";

import './Login.css';
const SignInSignup=()=>{
 const [LoginEmail,SetEmail]=useState('');
 const [Loginpassword,SetLoginPassword]=useState('');
const[isLogin,setIsLogin]=useState(true);



 const [SignupEmail,SetsignupEmail]=useState('');
 const [Signuppassword,SetsignPassword]=useState('');

const[Signupname,setsignupName]=useState('');

const[signupConfirmpassword,Setsignupconfirmpassword]=useState('');

const handleloginsubmit=(e)=>{
e.preventDefault();
console.log('Login submitted',LoginEmail,Loginpassword);

};

const hanleSignupsubmit=(e)=>
{
e.preventDefault();
console.log('signup form submitted',SignupEmail,Signupname,Signuppassword,signupConfirmpassword);

};



return(


    <div className="login-container">
        
        <div className="login-form">
        
{isLogin?(
         <form onSubmit={handleloginsubmit}>
      
           <h2> Login</h2>
       <div className="input-group">
            <label className="form-group"> Email</label>
             <input className="form-group" type="text" id="LoginEmail" value={LoginEmail} onChange={(e)=>SetEmail(e.target.value)} />
        </div>
         <div className="input-group">
             <label className="form-group"> Password</label>
            <input className="form-group" type="password" id="loginpassword" value={Loginpassword} onChange={(e)=>SetLoginPassword(e.target.value)} />
         </div>


      
         <div className="input-group">
            <input type="submit" value="Login" />

        

         </div>
         </form>
):(



   <form onSubmit={hanleSignupsubmit}>
<h2>Register</h2>

       <div>
            <label> Name</label>
             <input className="form-group" type="text" id="Name" value={Signupname} onChange={(e)=>setsignupName(e.target.value)} />
        </div>

       <div>
            <label> Email</label>
             <input className="form-group" type="text" id="signupEmail" value={SignupEmail} onChange={(e)=>SetsignupEmail(e.target.value)} />
        </div>
         <div>
             <label> Password</label>
            <input className="form-group" type="password" id="signuppassword" value={Signuppassword} onChange={(e)=>SetsignPassword(e.target.value)} />
         </div>


         <div className="form-group">
             <label> Confirm Password </label>
            <input className="form-group" type="password" id="signupconfirmpassword" value={signupConfirmpassword} onChange={(e)=>Setsignupconfirmpassword(e.target.value)} />
         </div>
         <div className="form-group">
            <input type="submit" value="Register" />


         </div>


       </form>

)
}
<p className="signup-link">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <a href="#" onClick={() => setIsLogin(false)}>
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsLogin(true)}>
                Log in
              </a>
            </>
          )}
        </p>
    </div>
    </div>
);


}


export default SignInSignup;
