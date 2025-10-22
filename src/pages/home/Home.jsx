import { useEffect } from "react";
import JoinRoom from "../../components/joinRoom/JoinRoom";
import axios from 'axios';

const Home= ()=>{
    const baseurl= import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const user= JSON.parse(localStorage.getItem('user'));
    const isUserInAnyRoom= async()=>{
        try{
            const response= await axios.get(`${baseurl}/room/v2/currentroom/${user.id}`)
            console.log("response of check user room = ", response);

        }catch(e){
            console.log("error during get is joined room");
        }
    }
    useEffect(()=>{
        isUserInAnyRoom();
    },[])
    
    return(
        <>
            <JoinRoom/>
        </>
    )
}

export default Home;