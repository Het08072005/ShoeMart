import React, { useState } from "react";
import { 
  useVoiceAssistant, 
  BarVisualizer, 
  VideoTrack, 
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff, PhoneOff, Monitor, MonitorOff } from "lucide-react";

const AvatarVoiceAgent = ({ isMuted, setIsMuted, onEndCall }) => {
  const { state, audioTrack } = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Get the agent's video track (find the participant that isn't the local user)
  const tracks = useTracks([Track.Source.Camera]);
  const agentVideoTrack = tracks.find((t) => t.participant.identity !== localParticipant.identity);

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
      } else {
        await localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      }
    } catch (e) {
      console.error("Screen share error:", e);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-black">
      {/* 1. Main Video Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {agentVideoTrack ? (
          <VideoTrack 
            trackRef={agentVideoTrack} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
             <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
             <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Connecting...</span>
          </div>
        )}

        {/* Live Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md border border-white/10">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[9px] text-white font-black tracking-tighter uppercase">Live Session</span>
        </div>

        {/* Audio Visualizer */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-10 flex items-center justify-center">
            <BarVisualizer state={state} trackRef={audioTrack} barCount={7} />
        </div>
      </div>

      {/* 2. Controls Overlay - Visible on hover */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
            isMuted ? 'bg-red-500 border-red-400 text-white' : 'bg-zinc-900/80 border-white/10 text-white hover:bg-zinc-800'
          }`}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button 
          onClick={onEndCall}
          className="h-10 px-5 bg-red-600 hover:bg-red-500 text-white border border-red-500 rounded-full text-[10px] font-black flex items-center gap-2 transition-all shadow-xl tracking-widest uppercase"
        >
          <PhoneOff size={14} />
          End Call
        </button>

        <button 
          onClick={toggleScreenShare}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
            isScreenSharing ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-900/80 border-white/10 text-white hover:bg-zinc-800'
          }`}
        >
          {isScreenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
        </button>
      </div>
    </div>
  );
};

export default AvatarVoiceAgent;