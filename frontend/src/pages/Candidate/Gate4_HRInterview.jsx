import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, Sparkles, User, Briefcase } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { candidateAPI } from '../../services/api';
import AudioVisualizer from '../../components/AudioVisualizer';
import { useNavigate } from 'react-router-dom';

const Gate4_HRInterview = () => {
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [aiState, setAiState] = useState('IDLE'); // IDLE, LISTENING, SPEAKING, THINKING
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    // 🤖 AI Voice Output
    const speak = (text) => {
        setAiState('SPEAKING');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; // Slightly faster/friendlier?
        utterance.pitch = 1.2; // Higher pitch for "Friendly HR" persona
        utterance.onend = () => setAiState('IDLE');
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        SpeechRecognition.stopListening();
        setAiState('THINKING');
        const userMsg = transcript;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

        try {
            // Call AI Backend with "HR" type
            const response = await candidateAPI.chatAgent(userMsg, "HR");
            const aiResponse = response.data.agent_message;

            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speak(aiResponse);

            // Logic to move to Gate 5 after X interactions? 
            // For demo, let's say after 4 exchanges.
            if (messages.length >= 4) {
                setTimeout(() => navigate('/candidate/gate-5'), 5000);
            }

        } catch (err) {
            setAiState('IDLE');
            console.error(err);
        }
        resetTranscript();
    };

    return (
        <div className="min-h-screen bg-orange-50/30 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Background Ambience - Warm */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-white to-white opacity-70" />

            {/* Header */}
            <div className="absolute top-8 left-8 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 z-20">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <span className="font-bold text-xs tracking-wider text-orange-600">CULTURE FIT ASSESSMENT</span>
            </div>

            {/* 🧠 THE AI AVATAR */}
            <div className="relative z-10 flex flex-col items-center mb-8 mt-10">
                <div className="relative">
                    {/* Glowing Aura (Warmer colors) */}
                    <motion.div
                        animate={{
                            scale: aiState === 'SPEAKING' ? [1, 1.1, 1] : 1,
                            opacity: aiState === 'SPEAKING' ? 0.3 : 0.1,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-56 h-56 rounded-full blur-3xl absolute top-0 left-0 -z-10 bg-orange-500`}
                    />

                    {/* The Orb */}
                    <div className="w-48 h-48 rounded-full border-8 border-white shadow-2xl flex items-center justify-center bg-orange-50 relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`} />

                        {/* Dynamic Core */}
                        <div className={`w-36 h-36 rounded-full bg-gradient-to-br transition-all duration-1000 shadow-inner ${aiState === 'THINKING' ? 'from-orange-400 to-red-500 animate-spin-slow' :
                                aiState === 'SPEAKING' ? 'from-orange-300 to-yellow-400 scale-105' :
                                    'from-gray-300 to-gray-400'
                            }`} />

                        {/* Status Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                            {aiState === 'THINKING' && <Sparkles className="animate-pulse" size={40} />}
                            {aiState === 'LISTENING' && <Mic className="animate-bounce" size={40} />}
                        </div>
                    </div>
                </div>

                {/* 🎵 THE VISUALIZER COMPONENT */}
                <div className="mt-8 scale-75 opacity-70">
                    <AudioVisualizer state={aiState} />
                </div>
            </div>

            {/* Transcript Log */}
            <div className="w-full max-w-2xl h-[400px] overflow-y-auto p-6 bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-100/50 mb-10 scrollbar-thin scrollbar-thumb-orange-100">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-2">
                            <Briefcase size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">"Hi! I'm here to learn more about you.<br />Tell me about a time you worked in a team..."</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`mb-6 flex w-full ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex max-w-[85%] items-end gap-2 ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>

                            {/* Avatar Icons */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                {m.role === 'ai' ? <Briefcase size={16} /> : <User size={16} />}
                            </div>

                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'ai'
                                ? 'bg-orange-50 border border-orange-100 text-gray-700 rounded-bl-none'
                                : 'bg-gray-800 text-white rounded-br-none'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 relative z-20">
                <button
                    onClick={listening ? handleSend : SpeechRecognition.startListening}
                    className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${listening
                        ? 'bg-red-500 shadow-red-200 hover:shadow-red-300'
                        : 'bg-orange-500 shadow-orange-200 hover:shadow-orange-300 hover:bg-orange-600'
                        }`}
                >
                    {listening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                </button>
                <p className="text-orange-900/40 font-medium text-sm tracking-wide">
                    {listening ? "Listening... (Tap to Send)" : "Tap Microphone to Speak"}
                </p>
            </div>
        </div>
    );
};

export default Gate4_HRInterview;
