import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import { hrAPI } from '../services/api';

const JobCreationChatbot = ({ onJobParsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hi! I'm your AI Assistant. Describe the job you want to post, and I'll fill out the form for you! 🚀" }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMsg = { type: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            // Call API
            const response = await hrAPI.parseJobRequirements(userMsg.text);

            // Add bot success message
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Great! I've extracted the details and filled the form for you. Please review the details before submitting. ✨"
            }]);

            // Pass data to parent
            if (onJobParsed && response?.data) {
                onJobParsed(response.data);
            } else {
                throw new Error("Invalid response from AI agent");
            }

        } catch (error) {
            console.error("AI Parse Error:", error);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Oops! I encountered an error processing your request. Please try again or fill the form manually."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 animate-fade-in-up overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-primary p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AI Job assistant</h3>
                                <p className="text-xs text-white/80">Powered by Gemini</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                    ? 'bg-accent text-white rounded-tr-none'
                                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-accent" />
                                    <span className="text-xs text-gray-500">Analyzing requirements...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all">
                            <input
                                type="text"
                                placeholder="Type your job requirements..."
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !inputText.trim()}
                                className="text-accent hover:text-accent-hover disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${isOpen ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-100'
                    }`}
            >
                {isOpen ? (
                    <>
                        <X size={20} /> Close AI
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <Bot size={24} className="text-accent" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                            </span>
                        </div>
                        <span className="font-bold text-sm">Create with AI</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default JobCreationChatbot;
