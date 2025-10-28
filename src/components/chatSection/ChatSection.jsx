import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import socket from '../../socket';

export default function ChatSection() {
  const { roomid } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!roomid) return;
    
    socket.emit("join_room", { roomId: roomid });

    socket.on("chat_history", (msgs) => {
      setMessages(msgs);
    });

    socket.on("new_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("left_user", (userData) => {
      console.log("user left- ", userData);
      if (userData && userData.name) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            user: "System", 
            message: `${userData.name} left the room`,
            type: "left"
          }
        ]);
      }
    });

    socket.on("joined_user", (userData) => {
      console.log("user joined- ", userData);
      if (userData && userData.name) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            user: "System", 
            message: `${userData.name} joined the room`,
            type: "joined"
          }
        ]);
      }
    });

    return () => {
      socket.off("chat_history");
      socket.off("new_message");
      socket.off("left_user");
      socket.off("joined_user");
    };
  }, [roomid]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      roomId: roomid,
      user: user.name,
      message: text,
    });

    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Room Chat</h2>
            <p className="text-xs text-gray-400">Active now</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => {
          if (msg.user === "System") {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className={`px-4 py-2 rounded-full text-xs font-medium inline-flex items-center gap-2 ${
                  msg.type === "joined" 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    msg.type === "joined" ? "bg-green-400" : "bg-red-400"
                  }`}></div>
                  {msg.message}
                </div>
              </div>
            );
          }
          if (msg.user === user.name) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="flex flex-col items-end max-w-[75%]">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg">
                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  </div>
                  {msg.timestamp && (
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="flex flex-col items-start max-w-[75%]">
                <span className="text-xs font-medium text-blue-400 mb-1 px-2">
                  {msg.user}
                </span>
                <div className="bg-gray-700/80 backdrop-blur-sm text-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-lg border border-gray-600/30">
                  <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                </div>
                {msg.timestamp && (
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-700/50 rounded-2xl border border-gray-600/50 focus-within:border-blue-500/50 transition-all">
            <Input 
              type="text" 
              placeholder="Type a message..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 text-sm"
            />
          </div>
          <Button 
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl h-12 w-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}