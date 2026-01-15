// import { useState, useCallback, useEffect } from "react";
// import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
// import "@livekit/components-styles";
// import AvatarVoiceAgent from "./AvatarVoiceAgent";
// import "./LiveKitWidget.css";


// const LiveKitWidget = ({ setShowSupport }) => {
//   const [token, setToken] = useState(null);
//   const [isConnecting, setIsConnecting] = useState(true);

//   const getToken = useCallback(async () => {
//   try {
//     const response = await fetch(`/api/getToken?name=admin`);
//     const jwt = await response.text();
//     setToken(jwt);
//     setIsConnecting(false);
//   } catch (e) {
//     console.error(e);
//     setIsConnecting(false);
//   }
// }, []);


//   return (
    
//     <div className="modal-content">
//       <div className="support-room">
//         {isConnecting ? (
//           <div className="connecting-status">
//             <h2>Connecting to support...</h2>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowSupport(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         ) : token ? (
//           <LiveKitRoom
//             // serverUrl={import.meta.env.VITE_LIVEKIT_URL}
//             serverUrl="wss://ecommerce-31l53jsu.livekit.cloud"
//             token={token}
//             connect={true}
//             video={false}
//             audio={true}
//             onDisconnected={() => {
//               setShowSupport(false);
//               setIsConnecting(true);
//             }}
//           >
//             <RoomAudioRenderer />
//             <AvatarVoiceAgent />
//           </LiveKitRoom>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default LiveKitWidget;













// import { useState, useCallback, useEffect } from "react";
// import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
// import "@livekit/components-styles";
// import AvatarVoiceAgent from "./AvatarVoiceAgent";
// import api from "../api/axios";
// import "./LiveKitWidget.css";

// const LiveKitWidget = ({ setShowSupport }) => {
//   const [token, setToken] = useState(null);
//   const [isConnecting, setIsConnecting] = useState(true);

//   const getToken = useCallback(async () => {
//     try {
//       const res = await api.get("/getToken", {
//         params: { name: "admin" },
//       });
//       setToken(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsConnecting(false);
//     }
//   }, []);

//   useEffect(() => {
//     getToken();
//   }, [getToken]);

//   return (
//     <div className="modal-content">
//       <div className="support-room">
//         {isConnecting ? (
//           <div className="connecting-status">
//             <h2>Connecting to support...</h2>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowSupport(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         ) : token ? (
//           <LiveKitRoom
//             serverUrl="wss://ecommerce-31l53jsu.livekit.cloud"
//             token={token}
//             connect={true}
//             video={false}
//             audio={true}
//             onDisconnected={() => {
//               setShowSupport(false);
//               setIsConnecting(true);
//             }}
//           >
//             <RoomAudioRenderer />
//             <AvatarVoiceAgent />
//           </LiveKitRoom>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default LiveKitWidget;





import React, { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { Mic, MicOff, PhoneOff, Monitor, Play, Headset, ShieldCheck, X } from "lucide-react";
import "@livekit/components-styles";
import AvatarVoiceAgent from "./AvatarVoiceAgent";
import api from "../../api/axios.js";

const LiveKitWidget = ({ mode = "sticky", setShowSupport }) => {
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const isHero = mode === "hero";

  const getToken = useCallback(async () => {
    try {
      setIsConnecting(true);
      const name = `user_${Date.now()}`;
      const res = await api.get("/getToken", { params: { name } });
      setToken(res.data);
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleEndCall = () => {
    setToken(null);
    if (setShowSupport) setShowSupport(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`${
      isHero ? "w-full max-w-4xl" : "fixed bottom-6 right-6 z-50 w-[400px]"
    } bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans text-white`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Headset size={16} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase">AI Concierge</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Main Video Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        {!token ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400" 
                className="w-full h-full object-cover" 
                alt="AI"
              />
            </div>
            <button
              onClick={getToken}
              disabled={isConnecting}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-full font-bold text-xs tracking-tighter flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Play size={14} fill="white" /> START CONSULTATION</>
              )}
            </button>
          </div>
        ) : (
          <LiveKitRoom
            serverUrl="wss://ecommerce-31l53jsu.livekit.cloud"
            token={token}
            connect={true}
            audio={!isMuted}
            onDisconnected={handleEndCall}
            className="w-full h-full relative"
          >
            <RoomAudioRenderer />
            <AvatarVoiceAgent isMuted={isMuted} setIsMuted={setIsMuted} onEndCall={handleEndCall} />
          </LiveKitRoom>
        )}
      </div>

      {/* Security Footer */}
      <div className="py-2 bg-black/50 flex items-center justify-center gap-2 border-t border-white/5">
        <ShieldCheck size={12} className="text-green-500" />
        <span className="text-[10px] text-gray-500 uppercase font-medium">Secured End-to-End Connection</span>
      </div>
    </div>
  );
};

export default LiveKitWidget;