import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, CheckCircle, Code, Terminal, Clock, Settings,
    Maximize2, ChevronDown, ChevronRight, AlertCircle, FileCode, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Design System Constants
const VS_THEME = {
    bg: '#1e1e1e',
    sidebar: '#252526',
    border: '#333333',
    accent: '#007acc',
    text: '#cccccc'
};

const Gate2_Coding = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('// Write your solution here\ndef two_sum(nums, target):\n    pass');
    const [activeTab, setActiveTab] = useState('problem');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showTests, setShowTests] = useState(false);

    // Mock Data
    const problem = {
        title: "Two Sum",
        difficulty: "Easy",
        timeLimit: "15 mins",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ]
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
        }, 2000);
    };

    const handleSubmit = () => {
        navigate('/candidate/gate-3');
    };

    return (
        <div className="h-screen bg-[#1e1e1e] text-slate-300 flex flex-col font-sans overflow-hidden">

            {/* IDE Header */}
            <header className="h-14 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <Code className="text-blue-500" size={20} />
                        <span>HireLens IDE</span>
                    </div>
                    <div className="h-4 w-px bg-gray-700" />
                    <span className="text-sm text-gray-400">{problem.title}</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#333] px-3 py-1.5 rounded-md text-sm">
                        <Clock size={16} className="text-white" />
                        <span className="font-mono text-white">14:32</span>
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={16} />}
                        Run Code
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">

                {/* Left Panel: Problem Description */}
                <div className="w-1/3 bg-[#1e1e1e] border-r border-[#333] flex flex-col min-w-[300px]">
                    <div className="flex border-b border-[#333]">
                        <button
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'problem' ? 'border-blue-500 text-white bg-[#1e1e1e]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setActiveTab('problem')}
                        >
                            Description
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'submissions' ? 'border-blue-500 text-white bg-[#1e1e1e]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setActiveTab('submissions')}
                        >
                            Submissions
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">{problem.difficulty}</span>
                        </div>

                        <div className="prose prose-invert max-w-none text-sm text-gray-300 select-text">
                            <p>{problem.description}</p>

                            <h3 className="text-white mt-6 mb-3 font-semibold">Examples</h3>
                            {problem.examples.map((ex, i) => (
                                <div key={i} className="bg-[#2d2d2d] rounded-lg p-4 mb-4 border border-[#444]">
                                    <p className="font-mono text-xs text-gray-400 mb-1">Input:</p>
                                    <code className="block bg-black/30 p-2 rounded text-blue-300 mb-2 font-mono text-xs">{ex.input}</code>
                                    <p className="font-mono text-xs text-gray-400 mb-1">Output:</p>
                                    <code className="block bg-black/30 p-2 rounded text-green-300 font-mono text-xs">{ex.output}</code>
                                </div>
                            ))}
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
                                padding: { top: 16 },
                                fontFamily: 'JetBrains Mono'
                            }}
                        />
                    </div>

                    {/* Terminal / Test Output */}
                    <motion.div
                        initial={{ height: 40 }}
                        animate={{ height: showTests ? 300 : 40 }}
                        className="bg-[#1e1e1e] border-t border-[#333] flex flex-col"
                    >
                        <button
                            onClick={() => setShowTests(!showTests)}
                            className="h-10 px-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#252526] w-full border-b border-[#333]"
                        >
                            {showTests ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <Terminal size={14} />
                            <span>Console</span>
                            {output && (
                                <span className={`ml-auto text-xs ${output.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {output.status === 'success' ? 'All Tests Passed' : 'Build Failed'}
                                </span>
                            )}
                        </button>

                        <div className="flex-1 p-4 font-mono text-sm bg-[#1e1e1e] overflow-y-auto">
                            {isRunning ? (
                                <div className="text-gray-400 animate-pulse">Running tests...</div>
                            ) : output ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 w-fit">
                                        <CheckCircle size={16} />
                                        <span>Accepted</span>
                                        <span className="text-gray-400 mx-2">|</span>
                                        <span className="text-gray-300">Runtime: 34ms</span>
                                    </div>
                                    <div className="text-gray-300 bg-[#2d2d2d] p-3 rounded-lg border border-[#444]">
                                        <pre className="whitespace-pre-wrap font-mono text-xs">{output.logs}</pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 italic">Run code to see output...</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Gate2_Coding;