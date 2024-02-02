import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/login and signup/login'
import New_Company from './components/login and signup/new_company';
import Homepage from './components/home/homepage';
import Invitation from './components/invitation/invitation';
import Reset from './components/password reset/reset';
import axios from 'axios';
import BASE_URL from './config';
function App() {
  useEffect(() => {
    
    const intervalId = setInterval(() => {
     
      axios.get(`${BASE_URL}/CMS/callbacks`)
        .then(response => {
          
          console.log(response.data);
        })
        .catch(error => {
          
          console.error('Error fetching data:', error);
        });
    }, 14 * 60 * 1000); 

    
    return () => clearInterval(intervalId);
  }, []); // Empty
  return (

    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-company" element={<New_Company />} />
      <Route path='/home' element={<Homepage />} />
      <Route path="/invite" element={<Invitation />} />
      <Route path="/reset" element={<Reset />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
