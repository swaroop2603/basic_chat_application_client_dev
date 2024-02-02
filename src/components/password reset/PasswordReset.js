// PasswordReset.js
import React, { useState } from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa";
import './passwordreset.css'; // Import the CSS file for styling
import axios from "axios";
import BASE_URL from "../../config";
const PasswordReset = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const handleResetPassword = async() => {
    try{
        const data={
            "mailid":email
        }
        const response=await axios({
            method:'post',
            url:`${BASE_URL}/CMS/resetlink`,
            data:data
        })
        setMessage("Reset link sent successfully to your email.");
        setTimeout(() => {
          onClose();
        }, 3000);
    }catch(error){
        setMessage("Error occurred. Please try again.");
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    }
  };

  return (
    <div className="modal_overlay_password_reset">
      <div className="password-reset-container">
        <FaTimes className="password_reset_close-icon" onClick={onClose} />
        <div className="input-container">
          <FaEnvelope className="img" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button onClick={handleResetPassword}>Reset Password</button>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default PasswordReset;
