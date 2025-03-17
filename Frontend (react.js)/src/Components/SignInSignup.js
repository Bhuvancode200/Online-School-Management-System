import React, { createContext,useState ,useContext} from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import './Login.css';
import {UserContext} from "./UserContext";

const SignInSignup = ({setUser}) => {

  const { setUserDetails } = useContext(UserContext); 
//const[Setcompdetials]=useState('');



  const [LoginEmail, SetEmail] = useState('');
  const [Loginpassword, SetLoginPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);


  // declaring for SignUp form
  const [SignupEmail, SetsignupEmail] = useState('');
  const [Signuppassword, SetsignPassword] = useState('');
  const [Signupname, setsignupName] = useState('');
  const [signupConfirmpassword, Setsignupconfirmpassword] = useState('');
  const [signupMobileNo, SetMobileNo] = useState('');
  const [error, setError] = useState(null);


  // Initialize the navigate hook
  const navigate = useNavigate();

  const handleloginsubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', LoginEmail, Loginpassword);

    // Example: Authenticate user (in real-world, validate against an API)
  


          //Check user Login Authentication Get Comapanydetails
          const LoginData = {
            companyID: "0",
            Email: LoginEmail,
            Password: Loginpassword,
            companyName:" ",
            MobileNo:"",
            Status:""
         
         };


         fetch("https://localhost:44350/api/Company/Validateuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Indicates JSON data is being sent
          },
          body: JSON.stringify(LoginData), // Send data in JSON format
        })
        .then((response) => {
          // Check if the response is OK (status 200–299)
          if (!response.ok) {
            // If not, handle the error (e.g., display an error message)
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Something went wrong with the login.");
            });
          }
          // Parse the response as JSON if successful
          return response.json().then(async (data) => {
            console.log("Raw Data:", data); // Check the full structure of the response
          
            return data;
          });
        })


          .then((data) => {
            console.log("After Parsing:", data);
            // Assign the response data to variables
            const usercompdatails={
               compID: data[0].COMPANY_ID,
               companyName : data[0].COMPANY_NAME,
               mobno : data[0].PH_NO,
               status : data[0].STATUS,
               Email:data[0].EMAIL

            };
            setUserDetails(usercompdatails);
            // Now you can use these variables
           // console.log("Company ID:", companyID1);
          //  console.log("Company Name:", companyName1);
          //  console.log("Mobile No:", mobileNo1);
         //   console.log("Status:", status1);
      
            // You can call Setcompdetials() here if needed
            

            navigate("/landing");//Navigate succefull to Landing page
          }) // Handle the success response here
                 
        
          .catch((error) => {
            // Catch and log any errors that occurred during the fetch operation
            console.error("Error:", error.message);
          });








        };






  // handle Signup Form
  const hanleSignupsubmit = (e) => {
    e.preventDefault();
    console.log('signup form submitted', SignupEmail, Signupname, Signuppassword, signupConfirmpassword);


setError('');

//check filed all are required  Signup form

if(!signupMobileNo||!SignupEmail||!Signuppassword||!signupConfirmpassword||!Signupname)
{

setError('All fields are required');
  return;
}

 // Validate Email Format
 const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
 if (!emailRegex.test(SignupEmail)) {
   setError("Please enter a valid email address.");
   return;
 }

 // Validate Password Length
 if (Signuppassword.length < 6) {
   setError("Password must be at least 6 characters long.");
   return;
 }

 // Check if Password and Confirm Password match
 if (Signuppassword !== signupConfirmpassword) {
   setError("Passwords do not match.");
   return;
 }


// Prepare the data to send to sign up form
const postData = {
   companyName: Signupname,
   Email: SignupEmail,
   MobileNo: signupMobileNo,
   Password: signupConfirmpassword,
   Address: "",
   Status: "Y"

};



 // Make a POST request to your API
 fetch("https://localhost:44350/api/Company/CompanyCreate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // Indicates JSON data is being sent
  },
  body: JSON.stringify(postData), // Send data in JSON format
})
  .then((response) => response.text())
  .then((data) => {
    console.log("Success:", data);

   
    navigate("/login" );//Navigate succefull to Landing page
  
    setIsLogin(true);
//set feilds are null
    SetsignupEmail(null);
    SetsignPassword(null);
    setsignupName('');
    Setsignupconfirmpassword(null);
    SetMobileNo(null);

    alert("Account Created,please Login ");
  })
  .catch((error) => {
    console.error("Error:", error);
    setError('Error during signup,Please try again');
  });






  };

  return (
    <div className="login-container">
      <div className="login-form">
        {isLogin ? (
          <form onSubmit={handleloginsubmit}>
            <h2> Login</h2>
            <div className="input-group">
              <label className="form-group"> Email</label>
              <input
                className="form-group"
                type="text"
                id="LoginEmail"
                value={LoginEmail}
                onChange={(e) => SetEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="form-group"> Password</label>
              <input
                className="form-group"
                type="password"
                id="loginpassword"
                value={Loginpassword}
                onChange={(e) => SetLoginPassword(e.target.value)}
              />
            </div>
            <div className="form-group">

            <label className="form-group"> </label>
              <input  className="form-group" type="submit" value="Login" />
            </div>
          </form>
        ) : (
          <form onSubmit={hanleSignupsubmit}>
            <h2>Register</h2>

            {error && <div className="error-message">{error}</div>} {/* Error Message */}
            <div>
              <label> Name</label>
              <input
                className="form-group"
                type="text"
                id="Name"
                value={Signupname}
                onChange={(e) => setsignupName(e.target.value)}
              />
            </div>

            <div>
              <label> Email</label>
              <input
                className="form-group"
                type="text"
                id="signupEmail"
                value={SignupEmail}
                onChange={(e) => SetsignupEmail(e.target.value)}
              />
            </div>

            <div>
              <label> Mobile No</label>
              <input
                className="form-group"
                type="text"
                id="signupMobileNo"
                value={signupMobileNo}
                onChange={(e) => SetMobileNo(e.target.value)}
              />
            </div>


            <div>
              <label> Password</label>
              <input
                className="form-group"
                type="password"
                id="signuppassword"
                value={Signuppassword}
                onChange={(e) => SetsignPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label> Confirm Password </label>
              <input
                className="form-group"
                type="password"
                id="signupconfirmpassword"
                value={signupConfirmpassword}
                onChange={(e) => Setsignupconfirmpassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Register" />
            </div>
          </form>
        )}
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
};

export default SignInSignup;
