import React, { useEffect, useState, useRef  } from "react";
import './message.css'
import { RxPaperPlane } from "react-icons/rx";
import axios, { Axios } from "axios";
import io, { Socket }  from "socket.io-client";
import Modal from "react-modal";
import ScrollToBottom from "react-scroll-to-bottom";
import BASE_URL from "../../config";
import MessageBar_company from "../Message company/message_company";

import { FaUserPlus } from "react-icons/fa";
import { BsBoxArrowRight } from "react-icons/bs";
 
import { FaUsers } from "react-icons/fa";
let socket
const modalStyles = {
    content: {
      width: "300px",
      height: "150px",
      margin: "auto",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center items horizontally
      justifyContent: "center", // Center items vertically
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };
  const yesButtonStyle = {
    flex: 1,
    marginRight: "10px",
    backgroundColor: "#3498db", // Change the color as needed
    color: "#ffffff", // Change the text color as needed
    borderRadius: "5px", // Add border radius
    padding: "8px 16px", // Add padding for better appearance
    cursor: "pointer",
  };
  
  // Style for the "No" button
  const noButtonStyle = {
    flex: 1,
    backgroundColor: "#e74c3c", // Change the color as needed
    color: "#ffffff", // Change the text color as needed
    borderRadius: "5px", // Add border radius
    padding: "8px 16px", // Add padding for better appearance
    cursor: "pointer",
  };
function Message_company({messages,setMessages,userdata, channelName, Channel_Id}){
    console.log(userdata)
    const [messageText,setMessageTest]=useState("");
    const [username,setusername]=useState([])
    const messagesEndRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownlist,setdropdownlist]=useState([])
    const [isNewDropdownOpen, setIsNewDropdownOpen] = useState(false);
    const [newDropdownList, setNewDropdownList] = useState([]);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const handleLeaveIconClick = () => {
      setIsLeaveModalOpen(true);
    };
  
    const handleLeaveConfirm = async() => {
      // Handle leave channel logic
      const response=await axios.delete(`${BASE_URL}/CMS/channel/users?channel_id=${Channel_Id}&user_id=${userdata.user_id}`)
      setIsLeaveModalOpen(false);
    };
  
    const handleLeaveCancel = () => {
      setIsLeaveModalOpen(false);
    };
  
  const handleDropdownToggle =async () => {
    await fetchusers(userdata.company_id)
    setIsNewDropdownOpen(false);
    setIsDropdownOpen(!isDropdownOpen);
    
    // console.log(dropdownlist)
  };
  const handleNewDropdownToggle = async () => {
    // Fetch logic for names in the new dropdown
    await fetchNewDropdownNames(userdata.company_id);
    setIsDropdownOpen(false);
    setIsNewDropdownOpen(!isNewDropdownOpen);
};
const fetchusers=async(company_id)=>{
    // console.log(Channel_Id)
    const response=await axios.get(`${BASE_URL}/CMS/company/employees/channel?company_id=${company_id}&channel_id=${Channel_Id}`)
    // console.log(response)
    const users=response.data
    // console.log(users)
    // console.log(response.data)
    setdropdownlist(users)

    


}
const fetchNewDropdownNames = async (company_id) => {
    // Placeholder data

    const response=await axios.get(`${BASE_URL}/CMS/channel/users?company_id=${company_id}&channel_id=${Channel_Id}`)
    const names=response.data
    setNewDropdownList(names);
};
const addintochannel=async(user_id,company_id,Channel_Id,username)=>{
    const data={
        "user_id":user_id,
        "company_id":company_id,
        "channel_id":Channel_Id
    }
    const response=await axios({
        method:"post",
        url:`${BASE_URL}/CMS/channel/users`,
        data:data
    })
    console.log("added succesfully",username)
    socket.emit('userjoined',Channel_Id,username)
    socket.on('joinedmessage', (message) => {
        console.log("joined message", message);
        // setMessages((prevMessages) => [...prevMessages, message]);
        setIsDropdownOpen(false);
     });
}
  const handleDropdownItemClick = async(user) => {
    await addintochannel(user.user_id,user.company_id,Channel_Id,user.username)
    // console.log("Selected user:", dummyName);
  };
  

   useEffect(()=>{
    const fetchusername=async()=>{
        try{
            //console.log(messages.user_id)
            const response=await axios.get(`${BASE_URL}/CMS/employees?user_id=${userdata.user_id}`)
            console.log("username",response)
            setusername(response.data.username)
        }
        catch(error){
            console.log(error)
        }
    }
    fetchusername()
   }, [userdata.user_id])
   const ENDPOINT=`${BASE_URL}`
   useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
       socket.disconnect();
    };
 }, []);
 useEffect(() => {
    socket.on('messagechannel', (message) => {
       console.log("in socket return", message);
       setMessages((prevMessages) => [...prevMessages, message]);
    });
 }, [socket, setMessages]);
    const handlesend=async(event)=>{
    try{
        console.log("sending")
        console.log(userdata)
        console.log(messages)
       
        const data={
            user_id:userdata.user_id,
            message:messageText,
            channel_id: Channel_Id
        }
        console.log(data)
        console.log("data for sending",data)
        const recevied= await axios({
            method: 'post',
            url: `${BASE_URL}/CMS/channel/chat`,
            data: data
        });
        console.log("data recived",recevied)
        const response=recevied.data.response
        // event.preventDefault();
        socket.emit('sendMessageChannel',recevied.data.message_id,messageText,userdata.user_id,Channel_Id)
        console.log("after sended",response)
        setMessages(response)
        console.log("sended")
    }catch(error){
        console.log(error)
    }

    setMessageTest("");
   }
   useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
}, [messages]);

   
    console.log("messages",messages)
    return <div className="message_conatiner_company">
        <div className="message_header_company">
             { channelName}
             
             <div className="user-dropdown">
              <FaUsers className="messages_company_icons" onClick={handleNewDropdownToggle}/>
            <FaUserPlus className="messages_company_icons" onClick={handleDropdownToggle}/>
          <BsBoxArrowRight className="messages_company_icons"  onClick={handleLeaveIconClick}/>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
            {dropdownlist.map((user, index) => (
                <div className="dropdown-item" key={index} onClick={() => handleDropdownItemClick(user)}>
                  {user.username} 
                </div>
              ))}
            </div>
          )}
          {isNewDropdownOpen && (
                        <div className="new-dropdown-menu">
                            {newDropdownList.map((name, index) => (
                                <div className="dropdown-item" key={index}>
                                    {name.username}
                                </div>
                            ))}
                        </div>
                    )}
        </div>
             

            </div>
            <div className="message_body_company">
            <ScrollToBottom className="messages_scrolltobottom_company" autoScroll={false}>
            {messages
            .filter((message, index, self) => self.findIndex(m => m.message_id === message.message_id) === index)
            .map((item, index) => (
                
               <div key={index}><MessageBar_company message={item} newmessages={item} name={username} ownername={userdata.username} owner_id={userdata.user_id}/></div>
            ))
         }
         <div ref={messagesEndRef}></div>
         </ScrollToBottom>
                </div>
                <div className="message_input">
<textarea value={messageText} onChange={(e)=>{
    setMessageTest(e.target.value)
}} placeholder="type message here"></textarea>
<button onClick={handlesend}><RxPaperPlane /></button>
                </div>
                <Modal
        isOpen={isLeaveModalOpen}
        onRequestClose={() => setIsLeaveModalOpen(false)}
        contentLabel="Leave Channel Modal"
        style={modalStyles} 
      >
        <div>
          <p>Are you sure you want to leave this channel?</p>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <button onClick={handleLeaveConfirm} style={yesButtonStyle}>Yes</button>
            <button onClick={handleLeaveCancel} style={noButtonStyle}>No</button>
            </div>
        </div>
      </Modal>
 
    </div>
}
export default Message_company