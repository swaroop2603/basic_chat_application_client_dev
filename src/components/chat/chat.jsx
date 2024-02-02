import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chat.css"; 
import Message  from "../messages/messages";
import Message_company from "../messages company/messages_company";
import BASE_URL from "../../config";

import Modal from "react-modal"

import { RxPaperPlane } from "react-icons/rx";
import { TiMessages } from "react-icons/ti";
import { FiEdit3 } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";
const modalStyles = {
  content: {
    width: "300px",
    height: "150px",
    margin: "auto",
    borderRadius: "10px",
    padding: "10px",
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
async function fetchmessages(chat_id){
    // console.log(chat_id)
    try{
       const response=await axios.get(`${BASE_URL}/CMS/message?chat_id=${chat_id}`) 
// console.log(response)
       return response.data
    }catch(error){
        console.error("Error fetching messages:", error);
        return [];
    }
}
async function fetchchannelmessages(channel_id){
  // console.log("channel_id",channel_id)
    try{
       const response=await axios.get(`${BASE_URL}/CMS/channel/chat?channel_id=${channel_id}`) 
// console.log(response)
       return response.data
    }catch(error){
        console.error("Error fetching messages:", error);
        return [];
    }
}
async function fetchUserName(user_id){
    try{
        const response=await axios.get(`${BASE_URL}/CMS/employees?user_id=${user_id}`)
        
        return response.data.username; 
    }catch(error){
        console.log(error)
    }
}
async function fetchchannelName(channel_id){
  try{
      const response=await axios.get(`${BASE_URL}/CMS/channelname?channel_id=${channel_id}`)
      // console.log("channel names",response)
      
      return response.data.channel_name; 
  }catch(error){
      console.log(error)
  }
}

function Chat({user,CEO}) {
  // const [userData, setUserData] = useState(null);
  const [chatmemberlist,setchatmemberlist]=useState(null)
  const [chatwindow,setchatwindow]=useState(false)
  const [UserName,seruserName]=useState([])
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages,setmessages]=useState([])
  const [ownerName,setOwnerName]=useState([])
  const [channelToggel,setchannelToggel]=useState(false)
  const [toggleButton, setToggleButton] = useState(false); 
  const [channeldata,setchanneldata]=useState(null)
  const [channelname,setchannelname]=useState([])
  const [selectedchannelId, setSelectedchannelId] = useState(null);
  const [messagewindow,setmessagewindow]=useState(false)
  const [channelMessageWindow, setChannelMessageWindow] = useState(false);
  const [userMessageWindow, setUserMessageWindow] = useState(false);
  const [isModaladd,setIsModaladd]=useState(false)
  const [invitetext,setinvitetext]=useState("")
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteSuccessmessage, setInviteSuccessmessage] = useState(false);
  const [issearchactive,setisserachactive]=useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [createchannel,setcreatechannel]=useState(false)
  const [newChannelName, setNewChannelName] = useState('');
  const [updateChannels,setupdateChannels]=useState(false)
  const [showEditWidget, setShowEditWidget] = useState(false);
  const [isemployeeremovemodal,setisemployeeremovemodal]=useState(false)
  const [remveingemployeedata,setremovingemployeedata]=useState('')
  const [companydetails,setcompanydetails]=useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CMS/company?company_id=${user.company_id}`);
        setcompanydetails(response.data)
      } catch (error) {
        console.error("Error fetching company name:", error);
        // Handle error as needed (show a message, log, etc.)
      }
    };

    fetchData();
  }, [user.company_id]);
  const handleaddiconClick=()=>{
    setIsModaladd(true)
  }
  const handlecanceladdiconclick=()=>{
    setIsModaladd(false)
  }
  const handleaddinvite=async()=>{
    const data={
      "mailid":invitetext,
      "company_id":user.company_id
    }
    try {
      await axios({
        method: 'post',
        url: `${BASE_URL}/CMS/invite`,
        data: data
      });
  
      // Set the success message and reset the input field
      setInviteSuccess(true);
      setInviteSuccessmessage("invitation sended sucessufully");
      setinvitetext('');
  
      // Hide the success message after a few seconds
      setTimeout(() => {
        setInviteSuccess(false);
      }, 5000); // 5000 milliseconds (5 seconds)
    } catch (error) {
      setInviteSuccess(true);
      setinvitetext('');
      setTimeout(() => {
        setInviteSuccess(false);
      }, 5000);
      
      
      setInviteSuccessmessage(error.response.data.error);
      
      console.error('Error sending invitation:', error.response.data.error);
      // Handle error cases if needed
    }
    
  }
  

  // console.log("messages_chat",messages)
  useEffect(() => {
    // console.log("useEffect is running"); // Add this line 
    const fetchData = async () => {
      try {
        // console.log(user.user_id)
        const response = await axios.get(`${BASE_URL}/CMS/company/employees?company_id=${user.company_id}`);
        // console.log(response.data); 
        setchatmemberlist(response.data)
        // setchatmemberlist(userDatawithname)
        // console.log("setchatmemberlist(userDatawithname)",chatmemberlist)
        // console.log("userdata",userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }; 
    const fetchChanneldata = async () => {
      try {
        // console.log(user.user_id)
        const response = await axios.get(`${BASE_URL}/CMS/channel?user_id=${user.user_id}`);
        
        // console.log(response)
        // console.log(response.data);
        const channeldataname=await Promise.all(response.data.map(async (item)=>{
          // console.log("channel items",item)
          
            const channelName=await fetchchannelName(item.channel_id)
            return {...item,channelName}
          
          

            
            
        }));
        
        setchanneldata(channeldataname)
        // console.log("channel names",channeldataname)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
    fetchChanneldata()
    
    
    // console.log("channels",channeldata)
  }, [updateChannels]); // Empty dependency array to run the effect only once
  const handleButtonClick = async(userId) => {

    setSelectedchannelId(null);
    // console.log(chat_id)
    const response=await axios.get(`${BASE_URL}/CMS/chat/id?user_id1=${user.user_id}&user_id2=${userId}`)
    let chat_id
    if (response.data === null) {
      console.log("inside if");
    const data = {
      'user_id1': user.user_id,
      'user_id2': userId,
      'company_id': user.company_id
    };

    const create_response = await axios({
      method: 'post',
      url: `${BASE_URL}/CMS/chat`,
      data: data
    });

    chat_id = create_response.data.chat_id;
  } else {
    chat_id = response.data.chat_id;
  }

  
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null: userId));
    console.log("selected user id",selectedUserId)
   
    
    setChannelMessageWindow(false);
    setchatmemberlist((prevList) =>
        prevList.map((userObj) =>
          userObj.user_id === userId ? { ...userObj, chat_id: chat_id } : userObj
        )
      );
    
    const messages=await fetchmessages(chat_id)
    setmessages(messages)
  };
  useEffect(() => {
    console.log("selected user id", selectedUserId);
  
    if (selectedUserId === null) {
      setUserMessageWindow(false);
    } else {
      setUserMessageWindow(true);
    }
  }, [selectedUserId]);
  useEffect(() => {
    console.log("selected user id", selectedUserId);
  
    if (selectedchannelId === null) {
      setChannelMessageWindow(false);
    } else {
      setChannelMessageWindow(true);
    }
  }, [selectedchannelId]);
  const handleButton_channelClick= async(channel_id) => {
    setSelectedUserId(null);
    // console.log(channel_id)
    
    setSelectedchannelId((prevchannelid) => (prevchannelid === channel_id ? null : channel_id));
    
    setUserMessageWindow(false);
    const messages=await fetchchannelmessages(channel_id)
    setmessages(messages)
  };
  const handleToggle=()=>{
    setchannelToggel((prev)=>!prev)
    setToggleButton((prev)=>!prev)
    setUserMessageWindow(false); // Close user message window when toggling channels
    setChannelMessageWindow(false); 
  }
  const handlecreatechannel=()=>{
    setcreatechannel(true)

  }
  const handleCancelCreateChannelClick = () => {
    setcreatechannel(false);
    setNewChannelName('');
  };

  const handleCreateChannel = async() => {
    const data={
      "company_id":CEO.company_id,
      "owner_id":CEO.owner_id,
      "channel_name":newChannelName
      
    }
    const response=await axios({
      method:'post',
      url:`${BASE_URL}/CMS/channel`,
      data:data
    })
    setcreatechannel(false);
    setupdateChannels(true)
    
    setNewChannelName('');
    
  };
 
  const handleEditCompany = () => {
    setShowEditWidget(true);
  };

  const handleCancelEditClick = () => {
    setShowEditWidget(false);
  };
  const handleRemoveEmployee = (user_id) => {
    setremovingemployeedata(user_id)
    setShowEditWidget(false);
    setisemployeeremovemodal(true)
   
  };
  const handleremoveemploeeCancel = () => {
    setremovingemployeedata('')
   setisemployeeremovemodal(false);
  };
  const handleremoveemploeeConfirm=async()=>{
    const response=await axios.delete(`${BASE_URL}/CMS/employees?user_id=${remveingemployeedata.user_id}`)

    setupdateChannels(true)
    setisemployeeremovemodal(false)
    setremovingemployeedata('')

  }
  const modalStyles_remove = {
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
  const editWidgetContent = showEditWidget && (
    <div className="edit-widget">
      <button onClick={handleCancelEditClick} className="edit-widget-close-button">
        X
      </button>
      <p>Edit Company</p>
      <div className="employee-list">
        {chatmemberlist &&
        
        chatmemberlist
        .filter((item) => item.user_id !== CEO.user_id)
        .map((employee) => (
            <div key={employee.user_id} className="employee-item">
              {employee.username}
              <button onClick={() => handleRemoveEmployee(employee)}>
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
  const createChannelModalStyles = {
    content: {
      width: "300px",
      height: "180px",
      margin: "auto",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    closeButton: {
      border: 'none',
      cursor: 'pointer',
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'transparent',
      fontSize: '16px',
      color: '#333',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      fontSize: '14px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    createButton: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      padding: '10px',
      width:'100%',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    cancelButton: {
      backgroundColor: '#ccc',
      color: '#333',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };
  
  const channelMessageWindowContent = (selectedchannelId || channelMessageWindow) && (
    <div className="chat_Messages">
      <Message_company
        messages={messages}
        setMessages={setmessages}
        userdata={user}
        channelName={
          channeldata.find((item) => item.channel_id === selectedchannelId)
            ?.channelName
        }
        Channel_Id={channeldata.find((item) => item.channel_id === selectedchannelId)
          ?.channel_id}
      />
    </div>
  );
  // console.log("user in channels  ",user)

  const userMessageWindowContent = (selectedUserId || userMessageWindow) && (
    <div className="chat_Messages">
      <Message
        messages={messages}
        setMessages={setmessages}
        userdata={user}
        userName={
          chatmemberlist.find((item) => item.user_id === selectedUserId)
            ?.username
        }
        ChatId={
          chatmemberlist.find((item) => item.user_id === selectedUserId)
            ?.chat_id
        }
      />
    </div>
  );
  return (
    <div className="chat_window">
      <div className="chat_container">
        <div className="chat_box">
          <div className="chats_chat">
            <input 
              className="input_search" 
              type="text" 
              placeholder={`Search on ${companydetails.company_name}`} 
              value={searchTerm}
              onChange={(e)=>{
                setSearchTerm(e.target.value);
                setisserachactive(e.target.value.length > 0);
              }}
            />
            <button className={`channel_toggle_button ${toggleButton ? "up" : "down"}`} onClick={handleToggle}>
              {toggleButton ? <FaCaretDown /> : <FaCaretRight />}Channels
            </button>
            {channelToggel && (
              <div className="chats_message_div">
                {channeldata && channeldata.length > 0 ? (
                  channeldata.map((item, index) => (
                    <button
                      className="chats_message_button"
                      onClick={() => handleButton_channelClick(item.channel_id)}
                      key={index}
                    > <FaUsers className="channel-logo"/>
                      
                      {item.channelName}
                    </button>
                  ))
                ) : (
                  <div>No channels present</div>
                )}
              </div>
            )}
            {chatmemberlist && issearchactive && (
              <div className="chats_message_div">
                {chatmemberlist.map((item, index) => (
                  // Filter based on the search term
                  (issearchactive && item.username.toLowerCase().includes(searchTerm.toLowerCase()))  && (
                    <button
                      className="chats_message_button"
                      onClick={() => handleButtonClick(item.user_id)}
                      key={index}
                      
                    >
                      <FaUser className="user-logo"/>
                      
                      {item.username}
                    </button>
                  )
                ))}
              </div>
            )}
            {chatmemberlist && !issearchactive && (
              <div className="chats_message_div">
                {chatmemberlist.map((item, index) => (
                  <button
                    className="chats_message_button"
                    onClick={() => handleButtonClick(item.user_id)}
                    key={index}
                  >
                    <FaUser  className="user-logo" />
                    {item.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {channelMessageWindowContent}
        {userMessageWindowContent}
        {editWidgetContent}
        {CEO.user_id === user.user_id && ( 
        <FiEdit3  className="ti-edit-container" onClick={handleEditCompany}/>
        )}
        {CEO.user_id === user.user_id && (
          <TiMessages className="ti-messages-container" onClick={handlecreatechannel}/>
        )}
        
        {CEO.user_id === user.user_id && ( 
          <FaUserPlus className="floating-button" onClick={handleaddiconClick} />
         
        )}
        
        
      </div>
      <Modal
  isOpen={createchannel}
  onRequestClose={handleCancelCreateChannelClick}
  contentLabel="Create Channel"
  style={createChannelModalStyles}
>
  <button
    onClick={handleCancelCreateChannelClick}
    style={createChannelModalStyles.closeButton}
  >
    X
  </button>
  <div style={{ paddingTop: '20px', textAlign: 'center' }}>
    <p style={createChannelModalStyles.title}>Create a new channel</p>
    <input
      value={newChannelName}
      type="text"
      placeholder="Channel Name"
      style={createChannelModalStyles.input}
      onChange={(e) => setNewChannelName(e.target.value)}
    />
    <button
      style={createChannelModalStyles.createButton}
      onClick={handleCreateChannel}
    >
      Create
    </button>
  </div>
</Modal>
      <Modal
        isOpen={isModaladd}
        onRequestClose={handlecanceladdiconclick}
        contentLabel="invite employees"
        style={modalStyles}
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={handlecanceladdiconclick}
            style={{border: '0px solid #ccc', cursor: 'pointer', position: 'absolute', right: '1px', zIndex: '1' ,backgroundColor: "rgba(0, 0, 0, 0)"}}
          >
            X
          </button>
          <div style={{ paddingTop:'30px' }}>
            {inviteSuccess && <p style={{ color: 'green' }}>{inviteSuccessmessage}</p>}
            <p>Enter the email ID of the person you want to invite to {companydetails.company_name}</p>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <input 
                value={invitetext} 
                type="email" 
                onChange={(e) => {
                  setinvitetext(e.target.value);
                }} 
              />
              <button onClick={handleaddinvite}>
                <RxPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isemployeeremovemodal}
        onRequestClose={() => setisemployeeremovemodal(false)}
        contentLabel="Leave Channel Modal"
        style={modalStyles_remove} 
      >
        <div>
          <p>Are you sure you want to remove {remveingemployeedata.username} from {companydetails.company_name}?</p>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <button onClick={handleremoveemploeeConfirm} style={yesButtonStyle}>Yes</button>
            <button onClick={handleremoveemploeeCancel} style={noButtonStyle}>No</button>
            </div>
        </div>
      </Modal>
    </div>
  );
  
}

export default Chat;
