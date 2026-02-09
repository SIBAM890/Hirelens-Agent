import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, CheckCircle, Code, Terminal, Clock, Settings,
    Maximize2, ChevronDown, ChevronRight, AlertCircle, FileCode, Check,
    Shield, ArrowRight, X, AlertTriangle, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { candidateAPI } from '../../services/api';

const Gate2_Coding = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('// Write your solution here\ndef two_sum(nums, target):\n    pass');
    const [activeTab, setActiveTab] = useState('problem');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showTests, setShowTests] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 mins

    // Proctoring State
    const [warnings, setWarnings] = useState(0);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [violationMessage, setViolationMessage] = useState(null);
    const [detectionStatus, setDetectionStatus] = useState('initializing');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Refs
    const webcamRef = useRef(null);
    const warningsRef = useRef(warnings);
    const lastViolationTime = useRef(0);
    const hasSubmittedRef = useRef(false); // To stop proctoring after submit

    // Sync Refs
    useEffect(() => { warningsRef.current = warnings; }, [warnings]);

    const MAX_WARNINGS = 3;

    // Load Face API Models
    useEffect(() => {
        const loadModels = async () => {
            const urls = [
                'https://justadudewhohacks.github.io/face-api.js/models',
                'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
            ];

            for (const url of urls) {
                try {
                    console.log(`Attempting to load models from: ${url}`);
                    await faceapi.nets.tinyFaceDetector.loadFromUri(url);
                    setIsModelLoaded(true);
                    setDetectionStatus('active');
                    console.log("Face API Models Loaded Successfully");
                    return;
                } catch (err) {
                    console.error(`Failed to load from ${url}`, err);
                }
            }
            setDetectionStatus('error');
            setViolationMessage("Failed to load AI models. Check internet connection.");
        };
        loadModels();
    }, []);

    // Violation Handler
    const handleViolation = (type) => {
        if (hasSubmittedRef.current) return;

        // Debounce
        const now = Date.now();
        if (now - lastViolationTime.current < 2000) return;
        lastViolationTime.current = now;

        const newCount = warningsRef.current + 1;
        setWarnings(newCount);

        // Report to API (Mock for now if API not ready for Gate 2 specifically, but using generic reportViolation)
        reportViolation(type);

        const msg = `Warning ${newCount}/${MAX_WARNINGS}: ${type}`;
        setViolationMessage(msg);
        setTimeout(() => setViolationMessage(null), 5000);

        if (newCount >= MAX_WARNINGS) {
            setViolationMessage("Maximum warnings exceeded. Auto-submitting...");
            setTimeout(() => handleSubmit(true), 2000);
        }
    };

    const reportViolation = async (type) => {
        try {
            await candidateAPI.reportViolation({
                candidate_id: "candidate_123",
                job_id: "job_123",
                violation_type: type
            });
        } catch (err) {
            console.error("Failed to report violation", err);
        }
    };

    // Face Detection Loop
    const missingFramesRef = useRef(0);

    useEffect(() => {
        if (!isModelLoaded || !webcamRef.current || hasSubmittedRef.current) return;

        const interval = setInterval(async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                try {
                    // Use more lenient settings for Coding (users look down/away)
                    // inputSize: 512 (better accuracy), scoreThreshold: 0.3 (more lenient)
                    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 });
                    const detections = await faceapi.detectAllFaces(video, options);

                    if (detections.length === 0) {
                        missingFramesRef.current++;
                        // Grace Period: Only warn after 5 consecutive seconds of no face
                        if (missingFramesRef.current > 5) {
                            handleViolation("No Face Detected");
                            setDetectionStatus('warning');
                            // We don't reset missingFrames immediately to avoid spam, 
                            // but the handleViolation debounce handles the alert rate limiting.
                            // We can cap it to avoid overflow.
                            missingFramesRef.current = 6;
                        } else if (missingFramesRef.current > 2) {
                            // Show warning state before violation
                            setDetectionStatus('warning');
                        }
                    } else if (detections.length > 1) {
                        // Multiple faces is immediate violation (stricter)
                        handleViolation("Multiple Faces Detected");
                        setDetectionStatus('warning');
                        missingFramesRef.current = 0;
                    } else {
                        // Face found - reset counter
                        missingFramesRef.current = 0;
                        setDetectionStatus('active');
                    }
                } catch (err) {
                    console.error("Face detection error", err);
                    setDetectionStatus('error');
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isModelLoaded]);

    // Fullscreen & Tab Monitoring
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) handleViolation("Tab Switched / Backgrounded");
        };
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !hasSubmittedRef.current) {
                handleViolation("Exited Fullscreen");
                setIsFullscreen(false);
            } else {
                setIsFullscreen(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    // Timer
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleRun = () => {
        setIsRunning(true);
        setShowTests(true);
        // Simulate Compilation
        setTimeout(() => {
            setIsRunning(false);
            setOutput({
                status: 'success',
                passed: 3,
                total: 3,
                logs: 'Test Case 1: Passed\nTest Case 2: Passed\nTest Case 3: Passed'
            });
        }, 1500);
    };

    const handleSubmit = (forced = false) => {
        hasSubmittedRef.current = true;
        if (document.fullscreenElement) document.exitFullscreen();
        navigate('/candidate/gate-3');
    };

    return (
        <div className="h-screen bg-[#1e1e1e] text-slate-300 flex flex-col font-sans overflow-hidden">

            {/* Header - Ultra Minimalist (Timer + Actions only) */}
            <header className="h-16 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-6 select-none shrink-0 relative z-20">

                {/* Left: Timer */}
                <div className={`flex items-center gap-3 font-mono text-xl font-bold transition-all ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    <Clock size={20} />
                    <span>{formatTime(timeLeft)}</span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-[#252526] px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Run Code (Ctrl+Enter)"
                    >
                        {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={18} className="text-green-500 fill-green-500" />}
                        <span>Run</span>
                    </button>

                    <button
                        onClick={() => handleSubmit(false)}
                        className="bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <span>Submit</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* Fullscreen Overlay */}
                {!isFullscreen && (
                    <div className="absolute inset-0 bg-[#1e1e1e]/95 backdrop-blur-sm z-[60] flex flex-col items-center justify-center text-center p-8">
                        <Maximize2 size={48} className="text-blue-500 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Fullscreen Required</h3>
                        <p className="text-slate-400 mb-6">To continue coding, you must enable fullscreen mode.</p>
                        <button onClick={toggleFullscreen} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
                            Enable Fullscreen
                        </button>
                    </div>
                )}

                {/* Webcam Overlay */}
                <div className={`absolute bottom-6 right-6 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-2xl border-2 z-50 transition-all ${warnings > 1 || detectionStatus === 'warning' ? 'border-red-500 animate-pulse' : 'border-[#333]'}`}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        mirrored={true}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        onUserMediaError={(err) => alert("Camera Access Denied!")}
                    />
                    <div className={`absolute top-2 left-2 backdrop-blur text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 ${detectionStatus === 'active' ? 'bg-green-500/50' : detectionStatus === 'warning' ? 'bg-red-500/50' : detectionStatus === 'error' ? 'bg-red-700/80' : 'bg-black/50'}`}>
                        <div className={`w-2 h-2 rounded-full ${detectionStatus === 'active' ? 'bg-green-400' : detectionStatus === 'warning' ? 'bg-red-400' : detectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'}`} />
                        {detectionStatus}
                    </div>
                </div>

                {/* Violation Toast */}
                <AnimatePresence>
                    {violationMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[70] bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md w-full"
                        >
                            <AlertTriangle size={32} className="text-white shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg">Proctoring Alert</h4>
                                <p className="text-sm opacity-90">{violationMessage}</p>
                            </div>
                            <button onClick={() => setViolationMessage(null)} className="ml-auto hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Left Panel: Problem Description */}
                <div className="w-1/3 bg-[#1e1e1e] border-r border-[#333] flex flex-col min-w-[350px]">
                    <div className="flex border-b border-[#333]">
                        {['Description', 'Submissions'].map(tab => (
                            <button
                                key={tab}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-white tracking-tight">Two Sum</h1>
                            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold border border-green-500/20">Easy</span>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none text-gray-400">
                            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
                            <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Example 1</h4>
                                    <div className="bg-[#252526] rounded-xl p-4 border border-[#333] font-mono text-xs space-y-2">
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-12">Input:</span>
                                            <span className="text-blue-300">nums = [2,7,11,15], target = 9</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-12">Output:</span>
                                            <span className="text-green-300">[0,1]</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Example 2</h4>
                                    <div className="bg-[#252526] rounded-xl p-4 border border-[#333] font-mono text-xs space-y-2">
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-12">Input:</span>
                                            <span className="text-blue-300">nums = [3,2,4], target = 6</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-12">Output:</span>
                                            <span className="text-green-300">[1,2]</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Editor & Terminal */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            defaultLanguage="python"
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 24, bottom: 24 },
                                fontFamily: 'JetBrains Mono, monospace',
                                lineHeight: 1.6
                            }}
                        />
                    </div>

                    {/* Terminal / Test Output */}
                    <motion.div
                        initial={{ height: 48 }}
                        animate={{ height: showTests ? 320 : 48 }}
                        className="bg-[#1e1e1e] border-t border-[#333] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-10"
                    >
                        <button
                            onClick={() => setShowTests(!showTests)}
                            className="h-12 px-6 flex items-center gap-3 text-sm text-gray-400 hover:text-white bg-[#252526] w-full border-b border-[#333] transition-colors"
                        >
                            {showTests ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <div className="flex items-center gap-2">
                                <Terminal size={16} />
                                <span className="font-semibold">Console</span>
                            </div>
                            {output && (
                                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded ${output.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {output.status === 'success' ? 'All Tests Passed' : 'Build Failed'}
                                </span>
                            )}
                        </button>

                        <div className="flex-1 p-6 font-mono text-sm bg-[#1e1e1e] overflow-y-auto">
                            {isRunning ? (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    Running tests on remote server...
                                </div>
                            ) : output ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <CheckCircle className="text-green-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Accepted</h4>
                                            <div className="text-gray-400 text-xs mt-1">Runtime: 34ms • Memory: 14.2MB</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#252526] p-4 rounded-xl border border-[#333]">
                                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Standard Output</div>
                                        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">{output.logs}</pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600 italic flex flex-col items-center justify-center h-full gap-2">
                                    <Terminal size={32} className="opacity-20" />
                                    <span>Run your code to see the output here</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div >
            </main >
        </div >
    );
};

export default Gate2_Coding;