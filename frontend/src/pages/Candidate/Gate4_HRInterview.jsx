import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video } from 'lucide-react';
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
            // For demo, let's say after 3 exchanges.
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
            {/* Warm Background for HR */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />

            {/* Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm tracking-widest text-orange-500">CULTURE FIT ASSESSMENT</span>
            </div>

            {/* 🧠 THE AI AVATAR */}
            <div className="relative z-10 flex flex-col items-center mb-12">
                <div className="relative">
                    {/* Glowing Aura (Warmer colors) */}
                    <motion.div
                        animate={{
                            scale: aiState === 'SPEAKING' ? [1, 1.2, 1] : 1,
                            opacity: aiState === 'SPEAKING' ? 0.8 : 0.3,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-48 h-48 rounded-full blur-2xl absolute top-0 left-0 -z-10 bg-orange-500`}
                    />

                    {/* The Orb */}
                    <div className="w-48 h-48 rounded-full border-4 border-white/10 backdrop-blur-md flex items-center justify-center bg-black/40 shadow-2xl">
                        <div className={`w-40 h-40 rounded-full bg-gradient-to-br transition-all duration-1000 ${aiState === 'THINKING' ? 'from-orange-400 to-red-600 animate-spin' :
                                aiState === 'SPEAKING' ? 'from-orange-300 to-yellow-400' :
                                    'from-gray-700 to-gray-800'
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
                {messages.length === 0 && <p className="text-gray-500 text-center italic mt-20">"Hi! I'm here to learn more about you. Tell me about a time you worked in a team..."</p>}
                {messages.map((m, i) => (
                    <div key={i} className={`mb-4 flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-4 rounded-xl ${m.role === 'ai'
                            ? 'bg-orange-500/10 border border-orange-500/30 text-orange-100 rounded-tl-none'
                            : 'bg-gray-700/50 border border-gray-600 text-gray-200 rounded-tr-none'
                            }`}>
                            <span className="text-[10px] opacity-50 block mb-1 font-mono tracking-wider">{m.role.toUpperCase()}</span>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={listening ? handleSend : SpeechRecognition.startListening}
                    className={`p-6 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${listening
                        ? 'bg-red-500 shadow-[0_0_30px_red]'
                        : 'bg-orange-500 shadow-[0_0_30px_orange]'
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

export default Gate4_HRInterview;
