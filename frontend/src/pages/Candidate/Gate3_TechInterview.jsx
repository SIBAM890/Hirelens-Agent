import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video } from 'lucide-react';
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
        // Optional: Select a specific voice if available
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices[0]; 
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/10 via-black to-black" />

            {/* Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm tracking-widest text-red-500">LIVE INTERVIEW SESSION</span>
            </div>

            {/* 🧠 THE AI AVATAR & VISUALIZER */}
            <div className="relative z-10 flex flex-col items-center mb-12">
                <div className="relative">
                    {/* Glowing Aura */}
                    <motion.div
                        animate={{
                            scale: aiState === 'SPEAKING' ? [1, 1.2, 1] : 1,
                            opacity: aiState === 'SPEAKING' ? 0.8 : 0.3,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-48 h-48 rounded-full blur-2xl absolute top-0 left-0 -z-10 ${aiState === 'LISTENING' ? 'bg-green-500' : 'bg-neon-blue'
                            }`}
                    />

                    {/* The Orb */}
                    <div className="w-48 h-48 rounded-full border-4 border-white/10 backdrop-blur-md flex items-center justify-center bg-black/40 shadow-2xl">
                        {/* If we had a 3D model, it would go here. For now, a dynamic gradient orb */}
                        <div className={`w-40 h-40 rounded-full bg-gradient-to-br transition-all duration-1000 ${aiState === 'THINKING' ? 'from-neon-purple to-pink-600 animate-spin' :
                                aiState === 'SPEAKING' ? 'from-neon-blue to-cyan-400' :
                                    'from-gray-700 to-gray-900'
                            }`} />
                    </div>
                </div>

                {/* 🎵 THE VISUALIZER COMPONENT */}
                <div className="mt-8">
                    <AudioVisualizer state={aiState} />
                </div>
            </div>

            {/* Transcript Log */}
            <div className="w-full max-w-3xl h-64 overflow-y-auto p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm mb-8 scrollbar-hide">
                {messages.length === 0 && <p className="text-gray-500 text-center italic mt-20">"Hello, I am your AI Interviewer. Introduce yourself..."</p>}
                {messages.map((m, i) => (
                    <div key={i} className={`mb-4 flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-4 rounded-xl ${m.role === 'ai'
                                ? 'bg-neon-blue/10 border border-neon-blue/30 text-cyan-100 rounded-tl-none'
                                : 'bg-neon-purple/20 border border-neon-purple/30 text-purple-100 rounded-tr-none'
                            }`}>
                            <span className="text-[10px] opacity-50 block mb-1 font-mono tracking-wider">{m.role.toUpperCase()}</span>
                            {m.text}
                        </div>
                    </div>
                ))}
                {transcript && <div className="text-gray-400 text-center italic animate-pulse">... {transcript}</div>}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={listening ? handleSend : SpeechRecognition.startListening}
                    className={`p-6 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${listening
                            ? 'bg-red-500 shadow-[0_0_30px_red]'
                            : 'bg-neon-blue shadow-[0_0_30px_#00f3ff]'
                        }`}
                >
                    {listening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-black" />}
                </button>
            </div>

            <p className="text-gray-500 mt-4 font-mono text-sm uppercase tracking-widest">
                {listening ? "Listening..." : "Tap Mic to Respond"}
            </p>
        </div>
    );
};

export default Gate3_TechInterview;