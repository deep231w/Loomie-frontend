import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconSend2 } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import socket from '../../socket';

export default function ChatSection() {
  const { roomid } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!roomid) return;
    
    socket.emit("join_room", { roomId: roomid });

    socket.on("chat_history", (msgs) => {
      setMessages(msgs);
    });

    socket.on("new_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("new_message");
    };
  }, [roomid]);

  const sendMessage = () => {
    if (!text.trim()) return console.log("no text");

    socket.emit("send_message", {
      roomId: roomid,
      user: user.name,
      message: text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col flex-1 p-2">
      
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
              msg.user === user.name
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            <span className="font-bold">{msg.user}: </span>
            {msg.message}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <Input 
          type="text" 
          placeholder="Type message" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-black"
        />
        <Button type="button" variant="outline" onClick={sendMessage}>
          <IconSend2 size={30} stroke={2} />
        </Button>
      </div>

    </div>
  );
}
