import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, Sparkles, User, Bot } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { candidateAPI } from '../../services/api';
import AudioVisualizer from '../../components/AudioVisualizer'; // <--- Imported custom component

const Gate3_TechInterview = () => {
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [aiState, setAiState] = useState('IDLE'); // IDLE, LISTENING, SPEAKING, THINKING
    const [messages, setMessages] = useState([]);

    // 🤖 AI Voice Output
    const speak = (text) => {
        setAiState('SPEAKING');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setAiState('IDLE');
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        SpeechRecognition.stopListening();
        setAiState('THINKING');
        const userMsg = transcript;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

        try {
            // Call AI Backend
            const response = await candidateAPI.chatAgent(userMsg, "TECHNICAL");
            const aiResponse = response.data.agent_message;

            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speak(aiResponse);
        } catch (err) {
            setAiState('IDLE');
            alert("AI Connection Failed");
        }
        resetTranscript();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Background Ambience - Subtle Light Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-50 opacity-70" />

            {/* Header */}
            <div className="absolute top-8 left-8 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 z-20">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <span className="font-bold text-xs tracking-wider text-primary">LIVE INTERVIEW SESSION</span>
            </div>

            {/* 🧠 THE AI AVATAR & VISUALIZER */}
            <div className="relative z-10 flex flex-col items-center mb-8 mt-10">
                <div className="relative">
                    {/* Glowing Aura */}
                    <motion.div
                        animate={{
                            scale: aiState === 'SPEAKING' ? [1, 1.1, 1] : 1,
                            opacity: aiState === 'SPEAKING' ? 0.3 : 0.1,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-56 h-56 rounded-full blur-3xl absolute top-0 left-0 -z-10 ${aiState === 'LISTENING' ? 'bg-green-400' : 'bg-primary'
                            }`}
                    />

                    {/* The Orb */}
                    <div className="w-48 h-48 rounded-full border-8 border-white shadow-2xl flex items-center justify-center bg-gray-50 relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`} />

                        {/* Dynamic Core */}
                        <div className={`w-36 h-36 rounded-full bg-gradient-to-br transition-all duration-1000 shadow-inner ${aiState === 'THINKING' ? 'from-indigo-600 to-purple-600 animate-spin-slow' :
                                aiState === 'SPEAKING' ? 'from-blue-500 to-cyan-400 scale-105' :
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

            {/* Chat/Transcript Log */}
            <div className="w-full max-w-2xl h-[400px] overflow-y-auto p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 mb-10 scrollbar-thin scrollbar-thumb-gray-200">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-2">
                            <Bot size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">"Hello, I am your AI Interviewer.<br />Please introduce yourself to start."</p>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`mb-6 flex w-full ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex max-w-[85%] items-end gap-2 ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                            {/* Avatar Icons */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                            </div>

                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'ai'
                                ? 'bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-none'
                                : 'bg-primary text-white rounded-br-none'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    </div>
                ))}

                {transcript && (
                    <div className="flex justify-end mt-4 px-4">
                        <div className="text-gray-400 text-sm italic border border-dashed border-gray-300 rounded-lg px-4 py-2 animate-pulse bg-gray-50">
                            Listening: "{transcript}..."
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 relative z-20">
                <button
                    onClick={listening ? handleSend : SpeechRecognition.startListening}
                    className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${listening
                        ? 'bg-red-500 shadow-red-200 hover:shadow-red-300'
                        : 'bg-primary shadow-blue-200 hover:shadow-blue-300 hover:bg-primary/90'
                        }`}
                >
                    {listening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                </button>
                <p className="text-gray-400 font-medium text-sm tracking-wide">
                    {listening ? "Listening... (Tap to Send)" : "Tap Microphone to Speak"}
                </p>
            </div>
        </div>
    );
};

export default Gate3_TechInterview;