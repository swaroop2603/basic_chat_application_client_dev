import React, { useState, useEffect } from "react";
import './message.css';

import axios from "axios";
import BASE_URL from "../../config";

function MessageBar({ message: { user_id, message, created_at }, name, ownername, owner_id }) {
  const [trimmedName, setTrimmedName] = useState(name);
  const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CMS/employees?user_id=${user_id}`);
        const username = response.data.username;
        setTrimmedName(username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [user_id]);

  useEffect(() => {
    setIsSentByCurrentUser(owner_id === user_id);
  }, [owner_id, user_id]);

  const formatTime = (created_at) => {
    const time = new Date(created_at);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    isSentByCurrentUser ? (
      <div className="messageContainer justifyEnd">
        <p className="sendText  colorWhite pr-10">{ownername}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{message}</p>
          <p className="messageTime colorWhite">{formatTime(created_at)}</p>
        </div>
      </div>
    ) : (
      <div className="messageContainer justifyStart">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{message}</p>
          <p className="messageTime colorDark">{formatTime(created_at)}</p>
        </div>
        <p className="sendText pl-10">{trimmedName}</p>
      </div>
    )
  );
}

export default MessageBar;
