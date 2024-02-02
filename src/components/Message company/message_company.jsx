import React, { useState, useEffect } from "react";
import './message.css';

import axios from "axios";
import BASE_URL from "../../config";
function MessageBar({ message: { user_ID, message, created_at }, name ,ownername,owner_id}) {
    console.log("name  ",name)
    const [trimmedName, setTrimmedName] = useState(name);
    const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/CMS/employees?user_id=${user_ID}`);
                const username = response.data.username;
                setTrimmedName(username);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, [user_ID]);

    useEffect(() => {
        setIsSentByCurrentUser(owner_id === user_ID);
    }, [owner_id, user_ID]);
  

    const formatTime = (created_at) => {
        const time = new Date(created_at);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    console.log(message)
  //   if (!user_ID || !created_at) {
  //     console.log("inside if",message)
  //     // Display in the middle for null user_ID or created_at
  //     return (
  //         <div className="messageContainer_company justifyCenter_company">
  //             <div className="messageBox_company backgroundLight_company">
  //                 <p className="messageText_company colorDark_company">{ReactEmoji.emojify(message)}</p>
  //             </div>
  //         </div>
  //     );
  // }

    return (
        isSentByCurrentUser ? (
          <div className="messageContainer_company justifyEnd_company">
            <p className="sendText_company pr-10_company colorWhite_company">{ownername}</p>
            <div className="messageBox_company backgroundBlue_company">
              <p className="messageText_company colorWhite_company">{message}</p>
              <p className="messageTime_company colorWhite_company">{formatTime(created_at)}</p>
            </div>
          </div>
        ) : (
          <div className="messageContainer_company justifyStart_company">
            <div className="messageBox_company backgroundLight_company">
              <p className="messageText_company colorDark_company">{message}</p>
              <p className="messageTime_company colorDark_company">{formatTime(created_at)}</p>
            </div>
            <p className="sendText_company pl-10_company colorWhite_company">{trimmedName}</p>
          </div>
        )
      );
}

export default MessageBar;