import YouTube from "react-youtube";
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";

const YoutubeSection= ({room})=>{
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

    return(
        <div className="flex flex-col items-center text-white">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
            />
        </div>

    )
}

export default YoutubeSection;