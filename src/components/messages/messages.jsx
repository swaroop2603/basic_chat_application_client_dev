import React, { useEffect, useState, useRef  } from "react";
import './message.css'
import { RxPaperPlane } from "react-icons/rx";
import axios from "axios";
import io, { Socket }  from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import MessageBar from "../Message/message";
import BASE_URL from "../../config";
let socket
function Message({messages,setMessages,userdata, userName, ChatId}){
    const [messageText,setMessageTest]=useState("");
    const [username,setusername]=useState([])
    const messagesEndRef = useRef(null);
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
    socket.on('message', (message) => {
       console.log("in socket return", message);
       setMessages((prevMessages) => [...prevMessages, message]);
    });
 }, [socket]);
    const handlesend=async(event)=>{
    try{
        console.log("sending")
        console.log(userdata)
        console.log(messages)
       
        const data={
            user_id:userdata.user_id,
            message:messageText,
            chat_id: ChatId
        }
        console.log("data for sending",data)
        const recevied= await axios({
            method: 'post',
            url: `${BASE_URL}/CMS/message`,
            data: data
        });
        console.log("data recived",recevied)
        const response=recevied.data.response
        // event.preventDefault();
        socket.emit('sendMessage',recevied.data.message_id,messageText,userdata.user_id,ChatId)
        
        
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
    return <div className="message_conatiner">
        <div className="message_header">
             { userName}
            </div>
            <div className="message_body">
            <ScrollToBottom className="messages_scrolltobottom" autoScroll={false}>
            {messages
            .filter((message, index, self) => self.findIndex(m => m.message_id === message.message_id) === index)
            .map((item, index) => (
               <div key={index}><MessageBar message={item} name={username} ownername={userdata.username} owner_id={userdata.user_id}/></div>
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
 
    </div>
}
export default Message