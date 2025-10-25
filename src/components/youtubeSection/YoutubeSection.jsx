import YouTube from "react-youtube";
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 
const DEFAULT_VIDEO = "dQw4w9WgXcQ";

export default function YoutubeSection({ roomId }) {
  const playerRef = useRef(null);
  const isRemoteAction = useRef(false);
  const [videoId, setVideoId] = useState(DEFAULT_VIDEO);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit("join_room", { roomId });
    socket.on("sync_state", ({ videoId: vId, currentTime, isPlaying }) => {
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

  // --- Helper: fetch video details (we need the title to build a good query)
  const fetchVideoDetails = async (vId) => {
    const url = "https://www.googleapis.com/youtube/v3/videos";
    const res = await axios.get(url, {
      params: {
        key: API_KEY,
        part: "snippet",
        id: vId,
      },
    });
    if (res?.data?.items?.length) {
      return res.data.items[0].snippet;
    }
    return null;
  };

  // --- Main: fetch recommendations based on the current video's title/channel
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // 1) Get snippet of current video to extract title/channel
        const snippet = await fetchVideoDetails(videoId);

        // fallback query if snippet not available
        const baseQuery = snippet
          ? `${snippet.title} ${snippet.channelTitle}`
          : "music";

        // 2) Search using q=baseQuery (works with API key)
        const searchRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            key: API_KEY,
            part: "snippet",
            q: baseQuery,
            type: "video",
            maxResults: 12,
            videoEmbeddable: true, // avoid non-embeddable videos
          },
        });

        // Normalize results: search returns items with id.videoId
        const items = (searchRes.data.items || []).filter(Boolean);

        const mapped = items.map((it) => ({
          videoId: it.id?.videoId,
          title: it.snippet?.title,
          thumbnail: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
          channelTitle: it.snippet?.channelTitle,
        }));

        setRecommendations(mapped);
      } catch (err) {
        console.error("YouTube API error:", err.response?.data || err.message || err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [videoId]);

  const opts = { height: "100%", width: "100%", playerVars: { autoplay: 0 } };

  const onReady = (event) => (playerRef.current = event.target);

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

  const handleSuggestionClick = (vId) => {
    if (!vId) return;
    setVideoId(vId);
    socket.emit("change_video", { roomId, videoId: vId });
  };

  useEffect(() => {
  socket.on("change_video", ({ videoId }) => {
    console.log("Received new video from server:", videoId);
    setVideoId(videoId);
  });

  return () => {
    socket.off("change_video");
  };
}, []);

  return (
    <div className="flex flex-col items-center text-white w-full">
      <div className="w-full max-w-4xl">
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "500",
            playerVars: { autoplay: 0 },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          className="w-full overflow-hidden"
        />
      </div>

      <div className="w2/5 px-4 mt-4">
        {loading ? (
          <div className="text-sm text-gray-400">Loading recommendations...</div>
        ) : (
          <div className="w-full max-w-4xl mt-4 px-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recommendations.map((vid) => (
                <div
                  key={vid.videoId}
                  className="cursor-pointer bg-gray-800 rounded p-2 hover:scale-105 transition"
                  onClick={() => handleSuggestionClick(vid.videoId)}
                >
                  <img src={vid.thumbnail} className="rounded w-full" />
                  <p className="text-xs mt-1 truncate">{vid.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
