import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Play, CheckCircle, Heart, Activity, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import { candidateAPI } from '../../services/api';

const Gate4_HRInterview = () => {
    const navigate = useNavigate();
    const [conversation, setConversation] = useState([]);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [sentiment, setSentiment] = useState('neutral'); // neutral, positive, negative
    const [showStarGuide, setShowStarGuide] = useState(true);

    // Web Speech API
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Get Application ID from Navigation State or Local Storage
    const location = useLocation();
    const [applicationId, setApplicationId] = useState(location.state?.applicationId || localStorage.getItem('currentApplicationId') || "123");

    useEffect(() => {
        if (applicationId && applicationId !== "123") {
            startHRInterview();
        } else if (applicationId === "123") {
            // Try to fetch active application if ID is missing/default
            // For now, we'll proceed but log warning. 
            // Ideally should fetch from backend: candidateAPI.getCurrentApplication()
            console.warn("Using default/mock Application ID: 123. This will 404 if not in DB.");
            startHRInterview();
        }
    }, [applicationId]);

    const startHRInterview = async () => {
        try {
            const res = await candidateAPI.startInterview(applicationId, 'HR');
            const question = res.data.question;
            const initialMsg = { role: 'ai', text: question };
            setConversation([initialMsg]);
            speak(question);
        } catch (err) {
            console.error("Failed start HR", err);
            // Enhanced Fallback for Demo
            const fallback = "Hello! I'm Sarah from HR. I see we have some connection issues, but I'd still love to chat. Could you tell me about a time you demonstrated leadership?";
            setConversation([{ role: 'ai', text: fallback }]);
            speak(fallback);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            // Optimized Voice Selection for "Sarah"
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes("Google US English") ||
                v.name.includes("Microsoft Zira") ||
                v.name.includes("Samantha") ||
                v.name.includes("Female")
            );

            if (femaleVoice) utterance.voice = femaleVoice;
            utterance.rate = 1.05; // Slightly faster for better flow
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsAISpeaking(true);
            utterance.onend = () => setIsAISpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSendAnswer = async () => {
        if (!transcript.trim()) return;
        SpeechRecognition.stopListening();

        const userMsg = { role: 'user', text: transcript };
        setConversation(prev => [...prev, userMsg]);

        // Mock Sentiment Analysis for UI effect
        const sent = transcript.length > 50 ? 'positive' : 'neutral';
        setSentiment(sent);

        try {
            const res = await candidateAPI.answerInterview(applicationId, transcript, 'HR');
            let aiText = res.data.question;

            if (res.data.completed) {
                aiText = "Thank you! We have everything we need. You will hear from us soon.";
                setTimeout(() => navigate('/candidate/gate-5'), 6000);
            }

            const aiMsg = { role: 'ai', text: aiText };
            setConversation(prev => [...prev, aiMsg]);
            resetTranscript();
            speak(aiText);
        } catch (err) {
            console.error("API Error", err);
        }
    };

    const toggleMic = () => {
        if (listening) {
            handleSendAnswer();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    if (!browserSupportsSpeechRecognition) return <div>Browser not supported</div>;

    return (
        <div className="min-h-screen bg-rose-50/30 flex flex-col font-sans text-slate-800 relative overflow-hidden">

            {/* Background Decoration - Subtler */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-100/40 to-transparent pointer-events-none" />

            {/* Header - Clean & Aligned */}
            <header className="w-full px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-rose-100/50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                            <Heart size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">Behavioral Interview</h1>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">Final Round</span>
                                <span>•</span>
                                <span>Culture Fit Evaluation</span>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Meter - Re-styled */}
                    <div className="flex items-center gap-3 bg-white pl-4 pr-1 py-1 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tone Analysis</span>
                        <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-full border border-slate-100">
                            <div className={`w-8 h-2 rounded-full transition-all duration-500 ${sentiment === 'positive' ? 'bg-green-500 shadow-sm' : 'bg-slate-200'}`} />
                            <div className={`w-8 h-2 rounded-full transition-all duration-500 ${sentiment === 'neutral' ? 'bg-blue-500 shadow-sm' : 'bg-slate-200'}`} />
                            <div className={`w-8 h-2 rounded-full transition-all duration-500 ${sentiment === 'negative' ? 'bg-red-500 shadow-sm' : 'bg-slate-200'}`} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Grid Layout */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 grid grid-cols-12 gap-8 relative z-10">

                {/* Left Column: AI Avatar & Question (Spans 8 cols) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    {/* Avatar Container */}
                    <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-white rounded-[2rem] shadow-xl shadow-rose-900/5 border-4 border-white overflow-hidden flex flex-col items-center justify-center bg-grid-slate-50">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-rose-50/50" />

                        {/* Status Chip */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border shadow-sm transition-all ${isAISpeaking ? 'bg-rose-500/10 border-rose-200 text-rose-600' : 'bg-white/60 border-white/50 text-slate-500'}`}>
                                <div className={`w-2 h-2 rounded-full ${isAISpeaking ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                                <span className="text-xs font-bold uppercase tracking-wider">{isAISpeaking ? 'Sarah is speaking...' : 'Listening'}</span>
                            </div>
                        </div>

                        {/* HR Avatar */}
                        <div className="relative z-10 text-center transform transition-all duration-700">
                            <div className={`w-48 h-48 mx-auto rounded-full bg-white p-2 shadow-2xl transition-transform duration-300 ${isAISpeaking ? 'scale-110 ring-8 ring-rose-100' : 'scale-100 ring-4 ring-white'}`}>
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt&top=longHairCurvy&style=transparent"
                                    alt="HR Avatar"
                                    className="w-full h-full rounded-full bg-indigo-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode='wait'>
                        {conversation.length > 0 && conversation[conversation.length - 1].role === 'ai' && (
                            <motion.div
                                key={conversation.length}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-400 to-orange-400" />
                                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} /> Current Question
                                </h3>
                                <p className="text-2xl font-medium text-slate-800 leading-relaxed font-serif">
                                    "{conversation[conversation.length - 1].text}"
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: User Feedback & Controls (Spans 4 cols) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                    {/* Live Camera Feed */}
                    <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-lg border-4 border-white relative group ring-1 ring-slate-200">
                        <Webcam className="w-full h-full object-cover opacity-90" mirrored={true} audio={false} />
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
                        </div>
                    </div>

                    {/* STAR Method Guide - Compact */}
                    {showStarGuide && (
                        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-lg shadow-indigo-500/5 relative overflow-hidden group hover:shadow-indigo-500/10 transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4 relative z-10">
                                <CheckCircle size={18} className="text-indigo-500" /> STAR Method
                            </h4>
                            <div className="grid grid-cols-2 gap-2 relative z-10">
                                <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                    <div className="text-xs font-bold text-indigo-500 mb-0.5">Situation</div>
                                    <div className="text-[10px] text-slate-400">Set the scene</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                    <div className="text-xs font-bold text-indigo-500 mb-0.5">Task</div>
                                    <div className="text-[10px] text-slate-400">Describe purpose</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                    <div className="text-xs font-bold text-indigo-500 mb-0.5">Action</div>
                                    <div className="text-[10px] text-slate-400">What you did</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                    <div className="text-xs font-bold text-indigo-500 mb-0.5">Result</div>
                                    <div className="text-[10px] text-slate-400">Outcome achieved</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="mt-auto">
                        <button
                            onClick={toggleMic}
                            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${listening
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-rose-500/30'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20'
                                }`}
                        >
                            {listening ? (
                                <><div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Stop Recording</>
                            ) : (
                                <><Mic className="w-5 h-5" /> Start Answer</>
                            )}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Gate4_HRInterview;
