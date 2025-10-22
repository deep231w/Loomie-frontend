import React, { useEffect, useState } from "react";
import socket from "../../socket";

export default function ChatTest() {
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receive_message", (data) => {
      console.log("📩 Message from server:", data);
      setReceived(data.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💬 Chat Test</h2>

      <input
        type="text"
        value={message}
        placeholder="Type your message..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <p>📨 Received: {received}</p>
    </div>
  );
}
