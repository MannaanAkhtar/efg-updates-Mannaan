"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DailyIframe, { DailyCall, DailyParticipant, DailyEventObjectWaitingParticipant } from "@daily-co/daily-js";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const GOLD = "#C9935A";
const DATAIKU_TEAL = "#2EBDAA";
const DATAIKU_LOGO = "https://images.ctfassets.net/5nvgvgqbpp73/6f63ePFTcBtQIWJiVIbKVV/708831f68f139c954afadead4486d894/White_Dataiku_Lockup_Logo.svg";
const EFG_LOGO = "/events-first-group_logo_alt.svg";

const EVENT = {
  roomName: "dataiku-executive-boardroom",
  title: "Executive AI Boardroom",
  sponsor: "Dataiku",
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface WaitingParticipant {
  id: string;
  name: string;
  awaitingAccess?: {
    level: "full";
  };
}

interface Participant {
  session_id: string;
  user_name?: string;
  local: boolean;
  video: boolean;
  audio: boolean;
  tracks: {
    video?: { state: string; persistentTrack?: MediaStreamTrack };
    audio?: { state: string; persistentTrack?: MediaStreamTrack };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HOST LOGIN
// ═══════════════════════════════════════════════════════════════════════════

function HostLogin({ onLogin }: { onLogin: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setLoading(true);
      onLogin(name, email);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Branding */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <img src={DATAIKU_LOGO} alt="Dataiku" className="h-6 opacity-70" />
          <div className="h-6 w-px bg-white/20" />
          <img src={EFG_LOGO} alt="EFG" className="h-5 opacity-50" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9935A]/10 border border-[#C9935A]/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C9935A] animate-pulse" />
            <span className="text-[#C9935A] text-xs tracking-wider uppercase">Host Access</span>
          </div>
          <h1 className="text-2xl font-light text-white mb-2">{EVENT.title}</h1>
          <p className="text-white/40 text-sm">Enter your details to join as host</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/40 text-xs tracking-wider mb-2 uppercase">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Chen"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9935A]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs tracking-wider mb-2 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9935A]/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C9935A] text-black font-medium tracking-wide hover:bg-[#B8844A] transition-colors disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Join as Host"}
          </button>
        </form>

        <p className="text-white/20 text-xs text-center mt-6">
          Host controls include: admit participants, recording, screen share
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WAITING PARTICIPANT CARD
// ═══════════════════════════════════════════════════════════════════════════

function WaitingParticipantCard({
  participant,
  onAdmit,
  onDeny,
}: {
  participant: WaitingParticipant;
  onAdmit: () => void;
  onDeny: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C9935A]/20 flex items-center justify-center">
          <span className="text-[#C9935A] text-sm font-medium">
            {participant.name?.charAt(0) || "?"}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-medium">{participant.name || "Guest"}</p>
          <p className="text-white/40 text-xs">Waiting to join</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAdmit}
          className="px-4 py-2 bg-green-500/20 text-green-400 text-xs font-medium rounded hover:bg-green-500/30 transition-colors"
        >
          Admit
        </button>
        <button
          onClick={onDeny}
          className="px-4 py-2 bg-red-500/20 text-red-400 text-xs font-medium rounded hover:bg-red-500/30 transition-colors"
        >
          Deny
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICIPANT TILE
// ═══════════════════════════════════════════════════════════════════════════

function ParticipantTile({ participant, isLarge }: { participant: Participant; isLarge?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const videoTrack = participant.tracks?.video?.persistentTrack;
    if (videoRef.current && videoTrack) {
      const stream = new MediaStream([videoTrack]);
      videoRef.current.srcObject = stream;
      setHasVideo(true);
    } else {
      setHasVideo(false);
    }
  }, [participant.tracks?.video?.persistentTrack]);

  const name = participant.user_name || "Guest";
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={`relative bg-black/50 rounded-lg overflow-hidden border border-white/10 ${isLarge ? "aspect-video" : "aspect-square"}`}>
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.local}
          className={`w-full h-full object-cover ${participant.local ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
          <div className="w-16 h-16 rounded-full bg-[#C9935A]/20 flex items-center justify-center">
            <span className="text-[#C9935A] text-xl font-medium">{initials}</span>
          </div>
        </div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 bg-black/60 rounded text-xs">
        {!participant.audio && <span className="text-red-400">🔇</span>}
        <span className="text-white">{participant.local ? "You (Host)" : name}</span>
      </div>

      {/* Host badge */}
      {participant.local && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-[#C9935A]/80 rounded text-xs text-black font-medium">
          HOST
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDED VIDEO ROOM
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// LOWER THIRD BANNER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LowerThirdBanner({ 
  show, 
  title, 
  subtitle,
  sponsorLogo 
}: { 
  show: boolean; 
  title: string; 
  subtitle?: string;
  sponsorLogo?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="absolute bottom-28 left-8 right-8 z-25 pointer-events-none"
        >
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-black/90 via-black/80 to-transparent backdrop-blur-sm border-l-4 border-[#C9935A] p-4 rounded-r-lg">
            <div className="flex items-center gap-4">
              {sponsorLogo && (
                <img src={sponsorLogo} alt="Sponsor" className="h-8 opacity-80" />
              )}
              <div>
                <h3 className="text-white font-medium text-lg">{title}</h3>
                {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOST CONTROLS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function HostControlsPanel({
  onAdmitAll,
  onDenyAll,
  onToggleBanner,
  onToggleLowerThird,
  showBanner,
  showLowerThird,
  waitingCount,
  bannerText,
  onBannerTextChange,
  lowerThirdTitle,
  lowerThirdSubtitle,
  onLowerThirdChange,
}: {
  onAdmitAll: () => void;
  onDenyAll: () => void;
  onToggleBanner: () => void;
  onToggleLowerThird: () => void;
  showBanner: boolean;
  showLowerThird: boolean;
  waitingCount: number;
  bannerText: string;
  onBannerTextChange: (text: string) => void;
  lowerThirdTitle: string;
  lowerThirdSubtitle: string;
  onLowerThirdChange: (title: string, subtitle: string) => void;
}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-20 left-4 z-30 w-10 h-10 rounded-full bg-[#C9935A] text-black flex items-center justify-center hover:bg-[#B8844A] transition-colors"
        title="Host Controls"
      >
        ⚙️
      </button>

      {/* Controls Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className="absolute top-32 left-4 w-72 bg-black/95 border border-white/10 rounded-lg p-4 z-30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-sm">Host Controls</h3>
              <button onClick={() => setShowPanel(false)} className="text-white/40 hover:text-white text-sm">✕</button>
            </div>

            {/* Waiting Room Actions */}
            {waitingCount > 0 && (
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-2">{waitingCount} waiting</p>
                <div className="flex gap-2">
                  <button
                    onClick={onAdmitAll}
                    className="flex-1 py-2 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30"
                  >
                    Admit All
                  </button>
                  <button
                    onClick={onDenyAll}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30"
                  >
                    Deny All
                  </button>
                </div>
              </div>
            )}

            {/* Banner Controls */}
            <div className="mb-4">
              <label className="text-white/40 text-xs uppercase tracking-wider">Top Banner</label>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => onBannerTextChange(e.target.value)}
                  placeholder="Banner message..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                />
                <button
                  onClick={onToggleBanner}
                  className={`w-full py-2 text-xs rounded transition-colors ${
                    showBanner 
                      ? "bg-[#C9935A] text-black" 
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {showBanner ? "Hide Banner" : "Show Banner"}
                </button>
              </div>
            </div>

            {/* Lower Third Controls */}
            <div className="mb-4">
              <label className="text-white/40 text-xs uppercase tracking-wider">Lower Third</label>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={lowerThirdTitle}
                  onChange={(e) => onLowerThirdChange(e.target.value, lowerThirdSubtitle)}
                  placeholder="Title..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                />
                <input
                  type="text"
                  value={lowerThirdSubtitle}
                  onChange={(e) => onLowerThirdChange(lowerThirdTitle, e.target.value)}
                  placeholder="Subtitle..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-xs"
                />
                <button
                  onClick={onToggleLowerThird}
                  className={`w-full py-2 text-xs rounded transition-colors ${
                    showLowerThird 
                      ? "bg-[#C9935A] text-black" 
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {showLowerThird ? "Hide Lower Third" : "Show Lower Third"}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-white/40 text-xs mb-2">Quick Overlays</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onLowerThirdChange("Executive AI Boardroom", "Powered by Dataiku");
                    onToggleLowerThird();
                  }}
                  className="py-2 bg-white/10 text-white/60 text-xs rounded hover:bg-white/20"
                >
                  Event Title
                </button>
                <button
                  onClick={() => {
                    onLowerThirdChange("Q&A Session", "Submit your questions");
                    onToggleLowerThird();
                  }}
                  className="py-2 bg-white/10 text-white/60 text-xs rounded hover:bg-white/20"
                >
                  Q&A Mode
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDED VIDEO ROOM (ENHANCED)
// ═══════════════════════════════════════════════════════════════════════════

function BrandedVideoRoom({
  call,
  participants,
  waitingParticipants,
  onAdmit,
  onDeny,
  onLeave,
  onToggleVideo,
  onToggleAudio,
  onToggleRecording,
  isRecording,
  localVideo,
  localAudio,
}: {
  call: DailyCall;
  participants: Participant[];
  waitingParticipants: WaitingParticipant[];
  onAdmit: (id: string) => void;
  onDeny: (id: string) => void;
  onLeave: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  localVideo: boolean;
  localAudio: boolean;
}) {
  const [showWaiting, setShowWaiting] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showLowerThird, setShowLowerThird] = useState(false);
  const [bannerText, setBannerText] = useState("Welcome to Executive AI Boardroom");
  const [lowerThirdTitle, setLowerThirdTitle] = useState("Executive AI Boardroom");
  const [lowerThirdSubtitle, setLowerThirdSubtitle] = useState("Powered by Dataiku");
  
  const localParticipant = participants.find(p => p.local);
  const remoteParticipants = participants.filter(p => !p.local);

  const handleAdmitAll = () => {
    waitingParticipants.forEach(p => onAdmit(p.id));
  };

  const handleDenyAll = () => {
    waitingParticipants.forEach(p => onDeny(p.id));
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Host Controls Panel */}
      <HostControlsPanel
        onAdmitAll={handleAdmitAll}
        onDenyAll={handleDenyAll}
        onToggleBanner={() => setShowBanner(!showBanner)}
        onToggleLowerThird={() => setShowLowerThird(!showLowerThird)}
        showBanner={showBanner}
        showLowerThird={showLowerThird}
        waitingCount={waitingParticipants.length}
        bannerText={bannerText}
        onBannerTextChange={setBannerText}
        lowerThirdTitle={lowerThirdTitle}
        lowerThirdSubtitle={lowerThirdSubtitle}
        onLowerThirdChange={(title, subtitle) => {
          setLowerThirdTitle(title);
          setLowerThirdSubtitle(subtitle);
        }}
      />

      {/* Top Banner Overlay */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-16 left-0 right-0 z-25 px-4"
          >
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#C9935A] to-[#B8844A] text-black py-3 px-6 rounded-lg text-center font-medium shadow-lg">
              {bannerText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lower Third Overlay */}
      <LowerThirdBanner
        show={showLowerThird}
        title={lowerThirdTitle}
        subtitle={lowerThirdSubtitle}
        sponsorLogo={DATAIKU_LOGO}
      />

      {/* Top Bar - Branding Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 ml-14">
            <img src={DATAIKU_LOGO} alt="Dataiku" className="h-5 opacity-80" />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white/60 text-sm">{EVENT.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs">Recording</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
              <span className="text-white/60 text-xs">{participants.length} participant{participants.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 pt-20 pb-24">
        <div className={`h-full max-w-7xl mx-auto grid gap-3 ${
          participants.length === 1 ? "grid-cols-1" :
          participants.length === 2 ? "grid-cols-2" :
          participants.length <= 4 ? "grid-cols-2" :
          participants.length <= 6 ? "grid-cols-3" :
          "grid-cols-4"
        }`}>
          {participants.map((p) => (
            <ParticipantTile key={p.session_id} participant={p} isLarge={participants.length <= 2} />
          ))}
        </div>
      </div>

      {/* Waiting Room Panel */}
      <AnimatePresence>
        {showWaiting && waitingParticipants.length > 0 && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="absolute top-20 right-4 bottom-24 w-80 bg-black/90 border border-white/10 rounded-lg p-4 z-30 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Waiting Room</h3>
              <button onClick={() => setShowWaiting(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {waitingParticipants.map((p) => (
                  <WaitingParticipantCard
                    key={p.id}
                    participant={p}
                    onAdmit={() => onAdmit(p.id)}
                    onDeny={() => onDeny(p.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting Room Notification */}
      <AnimatePresence>
        {waitingParticipants.length > 0 && !showWaiting && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setShowWaiting(true)}
            className="absolute top-20 right-4 z-30 flex items-center gap-2 px-4 py-2 bg-[#C9935A] text-black rounded-full font-medium text-sm shadow-lg"
          >
            <span className="relative">
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {waitingParticipants.length}
              </span>
              👥
            </span>
            <span>{waitingParticipants.length} waiting</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Bar - Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
          {/* Mic */}
          <button
            onClick={onToggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              localAudio ? "bg-white/20 hover:bg-white/30" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <span className="text-xl">{localAudio ? "🎙️" : "🔇"}</span>
          </button>

          {/* Camera */}
          <button
            onClick={onToggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              localVideo ? "bg-white/20 hover:bg-white/30" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <span className="text-xl">{localVideo ? "📹" : "📷"}</span>
          </button>

          {/* Screen Share */}
          <button
            onClick={() => call.startScreenShare()}
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <span className="text-xl">🖥️</span>
          </button>

          {/* Record */}
          <button
            onClick={onToggleRecording}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
            }`}
          >
            <span className="text-xl">{isRecording ? "⏹️" : "⏺️"}</span>
          </button>

          {/* Leave */}
          <button
            onClick={onLeave}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <span className="text-xl">📞</span>
          </button>
        </div>

        {/* Branding Footer */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-white/20 text-xs">Powered by</span>
          <img src={EFG_LOGO} alt="EFG" className="h-4 opacity-30" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HOST PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function HostPage() {
  const [stage, setStage] = useState<"login" | "connecting" | "joined" | "ended">("login");
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const callRef = useRef<DailyCall | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [waitingParticipants, setWaitingParticipants] = useState<WaitingParticipant[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);

  const handleLogin = async (name: string, email: string) => {
    setHostName(name);
    setHostEmail(email);
    setStage("connecting");

    try {
      // Get owner token
      const res = await fetch("/api/boardroom/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: EVENT.roomName,
          userName: name,
          isOwner: true,
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get host token");
      }

      const { token } = await res.json();

      // Create Daily call
      const call = DailyIframe.createCallObject({
        videoSource: true,
        audioSource: true,
      });

      callRef.current = call;

      // Event handlers
      call.on("joined-meeting", () => {
        setStage("joined");
        updateParticipants(call);
      });

      call.on("participant-joined", () => updateParticipants(call));
      call.on("participant-left", () => updateParticipants(call));
      call.on("participant-updated", () => updateParticipants(call));

      call.on("waiting-participant-added", (e) => {
        if (e?.participant) {
          setWaitingParticipants(prev => [...prev, e.participant as WaitingParticipant]);
        }
      });

      call.on("waiting-participant-removed", (e) => {
        if (e?.participant) {
          setWaitingParticipants(prev => prev.filter(p => p.id !== e.participant.id));
        }
      });

      call.on("recording-started", () => setIsRecording(true));
      call.on("recording-stopped", () => setIsRecording(false));

      call.on("left-meeting", () => {
        setStage("ended");
      });

      call.on("error", (e) => {
        console.error("Daily error:", e);
        setError("Connection error. Please try again.");
        setStage("login");
      });

      // Join
      await call.join({
        url: `https://eventsfirstgroup.daily.co/${EVENT.roomName}`,
        token,
        startVideoOff: false,
        startAudioOff: false,
      });

    } catch (err) {
      console.error("Join error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setStage("login");
    }
  };

  const updateParticipants = (call: DailyCall) => {
    const allParticipants = call.participants();
    const mapped: Participant[] = Object.values(allParticipants).map((p: any) => ({
      session_id: p.session_id,
      user_name: p.user_name,
      local: p.local,
      video: p.video,
      audio: p.audio,
      tracks: p.tracks,
    }));
    setParticipants(mapped);
  };

  const handleAdmit = (id: string) => {
    callRef.current?.updateWaitingParticipant(id, { grantRequestedAccess: true });
  };

  const handleDeny = (id: string) => {
    callRef.current?.updateWaitingParticipant(id, { grantRequestedAccess: false });
  };

  const handleLeave = () => {
    callRef.current?.leave();
  };

  const handleToggleVideo = () => {
    const newState = !localVideo;
    callRef.current?.setLocalVideo(newState);
    setLocalVideo(newState);
  };

  const handleToggleAudio = () => {
    const newState = !localAudio;
    callRef.current?.setLocalAudio(newState);
    setLocalAudio(newState);
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      await callRef.current?.stopRecording();
    } else {
      await callRef.current?.startRecording();
    }
  };

  useEffect(() => {
    return () => {
      callRef.current?.destroy();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (stage === "login") {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <HostLogin onLogin={handleLogin} />
      </>
    );
  }

  if (stage === "connecting") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <img src={DATAIKU_LOGO} alt="Dataiku" className="h-8 mx-auto mb-8 opacity-60" />
          <div className="w-12 h-12 border-2 border-white/20 border-t-[#C9935A] rounded-full animate-spin mx-auto" />
          <p className="text-white/60 mt-6 text-sm">Connecting as host...</p>
          <p className="text-white/30 mt-2 text-xs">{hostName}</p>
        </div>
      </div>
    );
  }

  if (stage === "ended") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#C9935A]/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-light text-white mb-4">Session Ended</h1>
          <p className="text-white/50 text-sm mb-8">
            Thank you for hosting the {EVENT.title}.
          </p>
          <button
            onClick={() => {
              setStage("login");
              setError(null);
            }}
            className="px-8 py-3 bg-[#C9935A] text-black font-medium hover:bg-[#B8844A] transition-colors"
          >
            Host Another Session
          </button>
        </div>
      </div>
    );
  }

  if (stage === "joined" && callRef.current) {
    return (
      <BrandedVideoRoom
        call={callRef.current}
        participants={participants}
        waitingParticipants={waitingParticipants}
        onAdmit={handleAdmit}
        onDeny={handleDeny}
        onLeave={handleLeave}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        onToggleRecording={handleToggleRecording}
        isRecording={isRecording}
        localVideo={localVideo}
        localAudio={localAudio}
      />
    );
  }

  return null;
}
