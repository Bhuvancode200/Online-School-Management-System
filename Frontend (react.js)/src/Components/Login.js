import React,{useState} from 'react';
import './Login.css'



    const Login=()=>{

    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[errormessage,setErrormessage]=useState('');



const handleLogin=(e)=>{

    e.preventDefault();
    console.log('Logging with :',email,password)
}



return(
<div className="login-container">
<div className="login-form">
<h2>Login 


</h2>
<form  onSubmit={handleLogin}>

<div className="form-group">
<label  className="form-group" htmlFor='Email'>  Email </label>

<input  type="email"  id="email" value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder="Enter your Email"/>


</div>



<div className="form-group">
<label  className="form-group" htmlFor=''>  Password </label>

<input  type="password"  id="password" value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder="Enter your Password"/>


</div>
<button type="submit" className="btn">Login</button>

</form>

<p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>


</div>

</div>

);

};

export default Login;