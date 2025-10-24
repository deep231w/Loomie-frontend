import YouTube from "react-youtube";
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import Navbar from "../Navbar/Navbar";
import SpotifySection from "../spotifySection/SpotifySection";
import YoutubeSection from "../youtubeSection/YoutubeSection";
import SidebarMenus from "../sidebarMenus/SidebarMenus";
import ChatSection from "../chatSection/ChatSection";

const Room = ({ room }) => {
  const playerRef = useRef(null);
  const isRemoteAction = useRef(false); 
  const roomId = room.id;
  const videoId = "dQw4w9WgXcQ";

  useEffect(() => {
    socket.emit("join_room", { roomId });

    socket.on("sync_state", ({ videoId, currentTime, isPlaying }) => {
      const player = playerRef.current;
      if (!player) return;

      isRemoteAction.current = true; 
      player.seekTo(currentTime, true);
      if (isPlaying) player.playVideo();
      else player.pauseVideo();

      setTimeout(() => (isRemoteAction.current = false), 500);
    });

    socket.on("video_action", ({ action, currentTime }) => {
      const player = playerRef.current;
      if (!player) return;

      isRemoteAction.current = true; 
      player.seekTo(currentTime, true);
      if (action === "play") player.playVideo();
      if (action === "pause") player.pauseVideo();

      setTimeout(() => (isRemoteAction.current = false), 500);
    });

    return () => {
      socket.off("sync_state");
      socket.off("video_action");
    };
  }, [roomId]);

  const opts = {
    height: "390",
    width: "640",
    playerVars: { autoplay: 0 },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange = (event) => {
    const player = playerRef.current;
    if (!player || isRemoteAction.current) return; 

    const currentTime = player.getCurrentTime();

    switch (event.data) {
      case 1: 
        socket.emit("video_action", { roomId, action: "play", currentTime });
        break;
      case 2: 
        socket.emit("video_action", { roomId, action: "pause", currentTime });
        break;
      case 3: 
        socket.emit("video_action", { roomId, action: "seek", currentTime });
        break;
      default:
        break;
    }
  };

  const [selectedSection, setSelectedSection] = useState(null);

  const renderSection = () => {
    switch (selectedSection) {
      case "youtube":
        return <YoutubeSection room={room}/>;
      case "spotify":
        return <SpotifySection />;
      default:
        return <YoutubeSection room={room}/>;
    }
  };


  return (
   <>
    <Navbar setSelectedSection={setSelectedSection}/> 

    <div className="flex flex-row h-[90vh] mt-2">
      
      <div className="w-[10vw] bg-gray-800 text-white p-2">
        <SidebarMenus />
      </div>

      <div className="flex-1 bg-black text-white p-4 overflow-y-auto">
        {renderSection()}
      </div>

      <div className="w-[25vw] bg-gray-700 text-white p-4 overflow-y-auto">
        <ChatSection />
      </div>
    </div>
  </>

  );
};

export default Room;
