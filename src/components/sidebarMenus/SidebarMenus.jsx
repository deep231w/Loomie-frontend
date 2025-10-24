import { IconDoorExit } from "@tabler/icons-react"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SidebarMenus() {

    const {roomid}=useParams();
    const user=JSON.parse(localStorage.getItem('user'));
    console.log("user in sidebar - ", user)
    const navigate=useNavigate();

    const handleExitRoom =async()=>{
        try{
          const payload ={
            userId:user.id
          }
            const response= await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/room/v2/leave/${roomid}`,payload)

        console.log("response of leaveing room-", response);
        if(response.status===200){
          console.log("user left successfully");
          navigate('/');
        }

        }catch(e){
            console.log("error during exit room- ", e);
        }
    }

  return (
    <div className="flex flex-col h-full justify-center items-center">      
      <button 
        onClick={()=>handleExitRoom()}
        className="mt-auto">
        <IconDoorExit size={30} stroke={2} />
      </button>
    </div>
  )
}
