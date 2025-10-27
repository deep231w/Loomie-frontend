import { IconDoorExit ,IconShare3 ,IconMicrophoneOff, IconCamera, IconDeviceImac} from "@tabler/icons-react"
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function SidebarMenus() {

    const {roomid}=useParams();
    const user=JSON.parse(localStorage.getItem('user'));
    console.log("user in sidebar - ", user)
    const navigate=useNavigate();
    const [loading,  setLoading]=useState(false);

    const handleExitRoom =async()=>{

        try{
          setLoading(true);
          const payload ={
            userId:user.id
          }
            const response= await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/room/v2/leave/${roomid}`,payload)

        console.log("response of leaveing room-", response);
        if(response.status===200){
          console.log("user left successfully");
          toast.success("left room successfylly!!")
          navigate('/');
        }

        }catch(e){
            console.log("error during exit room- ", e);
            toast.error("error during leaving room / server error");
        }finally{
          setLoading(false)
        }
    }

  return (
    <div className="flex flex-col justify-between items-center h-full ">
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner className="size-10" />
        </div>
      )}  
      <div className="brand-logo  text-white font-bold text-3xl">
        Loomiee
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mt-auto ">

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col items-center">
            <button>
              <IconCamera size={30} stroke={2}  />
            </button>
            <p>
              Camera
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <button>
              <IconMicrophoneOff size={30} stroke={2}  />
            </button>
            <p>
              Mic
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <button>
              <IconDeviceImac size={30} stroke={2}  />
            </button>
            <p>
              Screen
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button>
            <IconShare3 size={30} stroke={2}  />
          </button>
          <p>
            Share
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <button 
            onClick={()=>handleExitRoom()}
            className="mt-auto"
          >
            <IconDoorExit size={30} stroke={2} />
          </button>
          <p>Exit Room</p>
        </div>

      </div>
    </div>
  )
}
