import React, { useState } from "react";
import './login.css' 
import user_icon from '../assests/person.png'
import email_icon from '../assests/email.png'
import password_icon from '../assests/password.png'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import BASE_URL from "../../config";
const LoginSignup =()=>{
    const navigate = useNavigate();

    
   const handlelogin=async()=>{
    const username=document.querySelector('#username').value
    const email=document.querySelector('#email').value
    const password=document.querySelector('#password').value
   
    const company_id="5a660f61-a9cc-402d-81ec-d08d783b4a86"
    const data={
        company_id: company_id,
        user_name:username,
        password:password,
        email:email
    }
    
    try{
        const response=await axios({
            method:'post',
            url:`${BASE_URL}/CMS/employees`,
            data: data

        });
        navigate('/home')

    }
    catch(error){
        console.log(error)
    }
   }
    
  
    const handlecretaecompany=()=>{
navigate('./create-company')
    }
    return (
        <div className="container">
            <div className="header"
            >
                <div className="text">Signin</div>
                <div className="Underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" id="username" placeholder="Name"  required/>
                
                </div>
                
                
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" id="email" placeholder="Email id" required/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" id="password" placeholder="password" required/>
                </div>
                
                <div className="forgot-password">Lost passwprd?<span>click here!</span></div>
                <div className="create-company" onClick={handlecretaecompany}>create-company<span> click here!</span></div>
                <div className="submit-conatiner">
                    <div className="submit" onClick={handlelogin} >sign in</div>
                </div>
            </div>
            
        </div>
    )
}
export default LoginSignup;