import React, { useState } from "react";
import styles from './login.css'  
// import user_icon from '../assests/person.png'
import { FaUser } from "react-icons/fa";
// import email_icon from '../assests/email.png'
// import password_icon from '../assests/password.png'
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../config";
const New_Company =()=>{
    const [errorMessage, setErrorMessage] = useState('');
    const navigate=useNavigate()
    const handlecompany=()=>{
        navigate('/')
    }
    
    const handlesubmit=async()=>{
        const company_name = document.querySelector("#company_name").value;
  const user_name = document.querySelector("#user_name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  console.log(company_name)
  const requestData_company = {
    company_name:company_name,
    email:email
    
  };

        
        try{
            
            const response=await axios({
                method:'post',
                url:`${BASE_URL}/CMS/company`,
                data: requestData_company,
            });
            console.log(response.data)
            const company_id=response.data.company_id
            console.log(company_id)
            const requestdata_employees={
                company_id:company_id,
                user_name: user_name,
                email:email,
                password:password,
            }
            console.log("username",user_name)
            const employees_response=await axios({
                method:'post',
                url:`${BASE_URL}/CMS/employees`,
                data: requestdata_employees,
            });
            console.log(employees_response.data)
            const user_id=employees_response.data.user_id
            const requestData_owners={
                user_id:user_id,
                company_id:company_id

            }
            const response_owners=await axios({
                method:'post',
                url:`${BASE_URL}/CMS/owners`,
                data:requestData_owners
            })


            
    navigate('/home',{ state: { user: response.data } })
        }
        catch(error){
            console.log(error)
            if (error.response.data) {
                setErrorMessage(error.response.data.error);
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            } else {
                setErrorMessage('An error occurred during login.');
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        }
       }
    return (
        <div className="container">
            <div className="header"
            >
                <div className="text">New Company </div>
                <div className="Underline"></div>
            </div>
            <div className="inputs">
            <div className="input">
                    
                    <FaUser className="img" />
                    <input type="text"  id="company_name" placeholder="Company name" required/>
                </div>
                <div className="input">
                <FaUser className="img" />
                    <input type="text" id="user_name" placeholder="User name" required/>
                </div>
                
                <div className="input">
                    <FaEnvelope className="img" />
                    <input type="email"  id="email" placeholder="Email id" required/>
                </div>
                <div className="input">
                    <FaLock className="img"/>
                    <input type="password"  id="password" placeholder="password" required/>
                </div>
                <div className="create-company" onClick={handlecompany}>Employee login<span> click here!</span></div>
               
                
                
                
                <div className="submit-conatiner">
                    
                    <div className="submit" onClick={handlesubmit}>submit</div>
                    <div className="error-message">{errorMessage}</div>
                </div>
            </div>
            
        </div>
    )
}
export default New_Company;