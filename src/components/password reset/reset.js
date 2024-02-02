import React, { useState } from 'react';
import './reset.css'; // Import the CSS file for styling
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config';
import FloatingWarning from '../floating window/floating_window';
const Reset = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showWarningtext, setShowWarningtext] = useState("");
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  
  const token = searchParams.get('token');
  const mail_id=searchParams.get('mail_id')
  
  const handleSubmit = async(e) => {
    e.preventDefault();
try{
    const data={
        "email":mail_id,
        "token":token,
        "password":password,
       
    }
    const response=await axios({
        method:'put',
        url:`${BASE_URL}/CMS/forgot_password`,
        data:data
    })
    setUsername('')
    setPassword('')
    navigate('/');
    
}catch(error){
    
        // Handle error response
        if (error.response && error.response.status === 404) {
          // Display a warning message to the user
          setShowWarning(true);
        //   console.log(error)
          setShowWarningtext(error.response.data.error);
  
          // Hide the warning message after a few seconds (adjust as needed)
          setTimeout(() => {
            setShowWarning(false);
          }, 5000); // 5000 milliseconds (5 seconds)
        } else {
          // Handle other types of errors
          console.error('Error:', error.message);
        }

}
    
    
  };
  const closeWarning = () => {
    setShowWarning(false);
  };


  return (
    <div>
      <div className="inviation_floating-warning-container">
        {showWarning && (
          <FloatingWarning message={showWarningtext} onClose={closeWarning} />
        )}
      </div>
      <div className="invitation-form-container">
        <h2>Invitation Form</h2>
        <form onSubmit={handleSubmit} className="invitation-form">
          <label htmlFor="email" className='inviation_label '>Email:</label>
          <input
            type="email"
            id="email"
            value={mail_id}
            readOnly
            
            className='inviation_input'
            required
          />
          
          <label htmlFor="password" className='inviation_label '>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='inviation_input'
            required
          />
          <button className='inviation_button' type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
