import React, { useState } from "react";
import styles from './login.css' 

import { FaUser } from "react-icons/fa";

import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import BASE_URL from "../../config";
import PasswordReset from "../password reset/PasswordReset"; 
const LoginSignup = () => {
    const navigate = useNavigate();
    const [userData,setuserData]=useState([])
    const [errorMessage, setErrorMessage] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const handleLogin = async () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const data = {
            password: password,
            email: email
        };

        try {
            const response = await axios({
                method: 'post',
                url: `${BASE_URL}/CMS/login`,
                data: data
            });
            console.log("data fpor login",response)
           
           
            navigate('/home', { state: { user: response.data } });
        } catch (error) {
            console.log(error);
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
    };

    const handleCreateCompany = () => {
        navigate('./create-company');
    };
    const handlePasswordReset = () => {
        // Show the PasswordReset component
        setShowPasswordReset(true);
      };
    
      const closePasswordReset = () => {
        // Close the PasswordReset component
        setShowPasswordReset(false);
      };
    return (
        <div className="container">
            <div className="header">
                <div className="text">Signin</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <FaEnvelope className="img"/>
                    <input type="email" id="email" placeholder="Email id" required />
                </div>
                <div className="input">
                    <FaLock className="img" />
                    <input type="password" id="password" placeholder="password" required />
                </div>
                <div className="forgot-password" onClick={handlePasswordReset}>Lost password?<span>click here!</span></div>
                <div className="create-company" onClick={handleCreateCompany}>
                    create-company<span> click here!</span>
                </div>
                <div className="submit-conatiner">
                    <div className="submit" onClick={handleLogin}>sign in</div>
                </div>
                <div className="error-message">{errorMessage}</div>
            </div>
            {showPasswordReset && (
        <PasswordReset onClose={closePasswordReset} />
      )}
        </div>
    );
};

export default LoginSignup;