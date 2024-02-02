import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import "./header.css";

function Header({ user }) {
  const [companyname, setCompanyname] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CMS/company?company_id=${user.company_id}`);
        setCompanyname(response.data.company_name);
      } catch (error) {
        console.error("Error fetching company name:", error);
        // Handle error as needed (show a message, log, etc.)
      }
    };

    fetchData();
  }, [user.company_id]);

  return (
    <div className="header_header">
      <div className="search_header">
        <div className="search_bar_header">
          <span className="company-name">{companyname}</span>
          <span className="username">{user.username}</span>
        </div>
      </div>
      <div className="tasks_header">
        <button disabled className="button_header" >Task assigned</button>
        <button disabled className="button_header">Task pending</button>
        <button disabled className="button_header">Task completed</button>
        <button disabled className="button_header">Task missed</button>
      </div>
    </div>
  );
}

export default Header;
