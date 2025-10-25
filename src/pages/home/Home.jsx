import { useEffect, useState } from "react";
import JoinRoom from "../../components/joinRoom/JoinRoom";
import axios from 'axios';
import Room from "../../components/Room/Room";
import { useNavigate } from "react-router-dom";
import React from "react";
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';

const Home= ()=>{
    const baseurl= import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const user= JSON.parse(localStorage.getItem('user'));
    const [room, setRoom]=useState();
    const [inRoom,setInRoom]=useState(false);
    const navigate = useNavigate();


    const isUserInAnyRoom= async()=>{
        try{
            const response= await axios.get(`${baseurl}/room/v2/currentroom/${user.id}`)
            console.log("response of check user room = ", response);
            setRoom(response.data?.room);
            setInRoom(response.data?.inRoom)

        }catch(e){
            console.log("error during get is joined room");
        }
    }
    useEffect(()=>{
        isUserInAnyRoom();
    },[])


        useEffect(() => {
        if (inRoom && room?.id) {
            navigate(`/room/${room.id}`);
        }
    }, [inRoom, room, navigate]);

    
    return(
        <BackgroundGradientAnimation>
            <div className="brand-logo absolute top-4 left-6 z-50 text-white font-bold text-2xl">
                Loomiee
            </div>

            <div>
                <JoinRoom/>
            </div>

        </BackgroundGradientAnimation>
    )
}

export default Home;