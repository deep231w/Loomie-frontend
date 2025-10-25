import { IconDoorExit ,IconShare3} from "@tabler/icons-react"
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
    <div className="flex flex-col justify-between items-center h-screen px py-10">
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner className="size-10" />
        </div>
      )}  
      <div className="brand-logo  text-white font-bold text-3xl">
        Loomiee
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <button>
          <IconShare3 size={50} stroke={2}  />
        </button>
        <button 
          onClick={()=>handleExitRoom()}
          className="mt-auto"
        >
            <IconDoorExit size={50} stroke={2} />
        </button>
      </div>
    </div>
  )
}
