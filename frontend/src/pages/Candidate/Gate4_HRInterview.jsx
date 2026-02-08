import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, User, Bot, Volume2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';

const Gate4_HRInterview = () => {
    const navigate = useNavigate();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [conversation, setConversation] = useState([
        { role: 'ai', text: "Hi! I'm Sarah from HR. I'm really impressed with your technical assessment results." },
        { role: 'ai', text: "Now I'd love to chat about your career goals and what you're looking for in your next role." }
    ]);

    // HR Persona (Warmer, softer colors)
    const personaColor = 'rose';

    const handleEndCall = () => {
        // Navigate to results or trust score analysis
        navigate('/candidate/result'); // Assuming Gate 5 is result/score
    };

    return (
        <div className="h-screen bg-slate-900 flex flex-col overflow-hidden font-sans relative">

            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center p-6">

                {/* AI Avatar / Feed */}
                <div className="relative w-full max-w-5xl aspect-video bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
                    {/* Placeholder for 3D Avatar */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
                        <div className="relative w-64 h-64 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse-slow">
                            <div className="w-48 h-48 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <Briefcase size={80} className="text-rose-400" />
                            </div>

                            {/* Audio Visualizer Waves (Mock, softer for HR) */}
                            <div className="absolute -bottom-12 flex items-end justify-center gap-1 h-12">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 bg-rose-500 rounded-full"
                                        animate={{ height: [15, 35, 15] }}
                                        transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-6 right-6">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-medium text-white/90">REC 08:30</span>
                        </div>
                    </div>

                    <div className="absolute top-6 left-6">
                        <div className="bg-rose-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-rose-500/30 flex items-center gap-2">
                            <Bot size={14} className="text-rose-400" />
                            <span className="text-xs font-bold text-rose-100 uppercase tracking-widest">HR Cultural Fit</span>
                        </div>
                    </div>

                    {/* Captions Overlay */}
                    <div className="absolute bottom-6 left-0 right-0 px-12 text-center pointer-events-none">
                        <AnimatePresence>
                            {conversation.slice(-1).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl text-lg font-medium text-white shadow-lg max-w-3xl"
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* User Camera PIP */}
                <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                    className="absolute top-10 right-10 w-64 aspect-video bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-700 overflow-hidden cursor-move hidden lg:block"
                >
                    {isVideoOn ? (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <User className="text-slate-500" size={32} />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                <VideoOff className="text-red-500" size={20} />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6 relative z-20">
                <ControlBtn
                    icon={isMicOn ? <Mic /> : <MicOff />}
                    label={isMicOn ? "Mute" : "Unmute"}
                    isActive={isMicOn}
                    onClick={() => setIsMicOn(!isMicOn)}
                />
                <ControlBtn
                    icon={isVideoOn ? <Video /> : <VideoOff />}
                    label={isVideoOn ? "Stop Video" : "Star Video"}
                    isActive={isVideoOn}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                />

                <button
                    onClick={handleEndCall}
                    className="flex flex-col items-center gap-1 group px-4"
                >
                    <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all shadow-lg shadow-red-900/20 group-hover:scale-105">
                        <PhoneOff className="text-white fill-current" size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">End Call</span>
                </button>

                <ControlBtn
                    icon={<MessageSquare />}
                    label="Chat"
                />
                <ControlBtn
                    icon={<Briefcase />}
                    label="Role Info"
                />
            </div>
        </div>
    );
};

const ControlBtn = ({ icon, label, isActive = true, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 group min-w-[70px]"
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-slate-800 text-slate-200 group-hover:bg-slate-700' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">{label}</span>
    </button>
);

export default Gate4_HRInterview;
