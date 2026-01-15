import React, { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { Mic, MicOff, PhoneOff, Headset, Play, X, MessageSquare, ShieldCheck } from "lucide-react";
import "@livekit/components-styles";
import AvatarVoiceAgent from "./AvatarVoiceAgent";
import api from "../../api/axios.js";

const LiveKitWidgetSticky = ({ mode = "sticky", currentPath = "" }) => {
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(mode === "hero");

  const isHero = mode === "hero";
  
  // Logic: Hide the widget on the Home page, but DON'T unmount it if a session is active
  const isHiddenRoute = currentPath === "/";

  const getToken = useCallback(async () => {
    try {
      setIsConnecting(true);
      const name = `user_${Date.now()}`;
      const res = await api.get("/getToken", { params: { name } });
      setToken(res.data);
      setSessionStarted(true);
    } catch (err) {
      console.error("LiveKit connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleEndCall = () => {
    setToken(null);
    setSessionStarted(false);
  };

  // If user minimized the widget and it's not a hero section, show the floating bubble
  // Note: We only hide the bubble if isHiddenRoute is true
  if (!isHero && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${isHiddenRoute ? "hidden" : "fixed"} bottom-6 right-6 z-[9999] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-500 hover:scale-105 transition-all active:scale-95 border border-white/10`}
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div
      className={`${
        isHero ? "w-full max-w-[750px]" : "fixed bottom-6 right-6 z-[9999] w-[420px]"
      } ${
        isHiddenRoute ? "hidden" : "flex" 
      } flex-col bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Header */}
      <div className="flex items-center justify-end px-4 py-2  bg-transparent">
        {/* <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-500/20 rounded">
            <Headset size={14} className="text-indigo-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI Concierge</span>
        </div> */}
        {!isHero && (
          <button onClick={() => setIsOpen(false)} className="p-2  text-slate-200 hover:text-white transition-colors">
            <X size={22} />
          </button>
        )}
      </div>

      {/* Main Video Frame */}
      <div className="relative flex-1 m-2 bg-black border border-white/5 rounded-lg overflow-hidden group">
        {!sessionStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
            <div className="relative mb-4">
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400" 
                alt="AI Avatar" 
                className="w-20 h-20 rounded-full border-2 border-indigo-500/30 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse" />
            </div>
            
            <button
              onClick={getToken}
              disabled={isConnecting}
              className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 tracking-widest"
            >
              {isConnecting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  CONNECT VOICE
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <LiveKitRoom
              serverUrl="wss://ecommerce-31l53jsu.livekit.cloud"
              token={token}
              connect
              audio={!isMuted}
              onDisconnected={handleEndCall}
              className="w-full h-full"
            >
              <RoomAudioRenderer />
              <div className="absolute inset-0 z-10 flex flex-col">
                  <AvatarVoiceAgent 
                    isMuted={isMuted} 
                    setIsMuted={setIsMuted} 
                    onEndCall={handleEndCall} 
                  />
              </div>
            </LiveKitRoom>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveKitWidgetSticky;





