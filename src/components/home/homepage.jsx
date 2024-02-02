import {React,useEffect,useState} from "react";
import Header from "../headers/header";
import Chat from "../chat/chat"
import { useLocation } from 'react-router-dom';
import axios from "axios";
import BASE_URL from "../../config";
function Homepage(){
    const [CEO,setCEO]=useState(" ")
    const location = useLocation();
    const userData = location.state?.user;
    // console.log("home++",userData)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const owners = await axios.get(
              `${BASE_URL}/CMS/owners?company_id=${userData.company_id}`
            );
            setCEO(owners.data);
          } catch (error) {
            console.error("Error fetching owner data:", error);
          }
        };
        console.log(userData)
    
        fetchData();
      }, [userData.company_id]);
    



    return(
<div>
    <Header user={userData} CEO={CEO}/>
    <Chat  user={userData} CEO={CEO}/>
   </div>
    )
}
export default Homepage