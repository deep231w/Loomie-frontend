import { useState } from "react"
import { IconHomeExclamation } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import axios from "axios"
import { Spinner } from '../ui/spinner';
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function EmptySection() {
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate =useNavigate();
  const [roomCode, setRoomCode]=useState("");

  async function handleCreateRoom() {
    setLoading(true)
    try {
      const payload = { userId: user.id }
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/room/v2/create`,
        payload
      )
      console.log("Room created:", response)

      if(response.status ===201){
        toast.success("Room created successfully")
        navigate(`/room/${response.data.room.id}`);
      }
    } catch (e) {
      console.log("Error:", e)
      toast.error("Room creation failed / server error !!")
    } finally {
      setLoading(false)
    }
  }


  //enter code to join room 
  async function handleJoinRoomByCode() {
    if(!roomCode){
      toast.warning("please enter room code to join the room!")
      return
    }
    try{
      const payload={
        userId:user.id,
        roomCode
      }
      const response= await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/room/v2/joinroombycode`,payload)

      console.log("response of join room by code=", response);

      if(response.status===201){
        toast.success("Room joined successfully")
        setTimeout(() => {
        navigate(`/room/${response.data.room.id}`);
      }, 2000);
      }


    }catch(e){
      console.log("error during join room");
      toast.error("error during join room / server error ");

    }
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner className="size-10" />
        </div>
      )}

      <div className="  rounded-lg bg-white/10 backdrop-blur-none">
            <Empty className={loading ? "pointer-events-none opacity-40" : ""}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconHomeExclamation />
                </EmptyMedia>
                <EmptyTitle>No Rooms In Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any room or joined yet. Get started!
                  Or you can paste the link on browser your friend shared with you to join the room.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <div className="flex gap-2 flex-col">
                  <Button onClick={handleCreateRoom} disabled={loading}>
                    Create Room
                  </Button>
                  <h2 className="text-white">OR</h2>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="text" 
                      placeholder="Enter Room Code" 
                      disabled={loading} 
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      disabled={loading}
                      onClick={handleJoinRoomByCode}  
                    >
                      Join Room
                    </Button>
                  </div>
                </div>
              </EmptyContent>

              <Button variant="link" className="text-muted-foreground" size="sm">
                Learn More <ArrowUpRightIcon />
              </Button>
            </Empty>
      </div>
    </div>
  )
}
