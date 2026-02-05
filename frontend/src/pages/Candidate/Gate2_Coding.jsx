import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import { Play, ArrowRight, CheckCircle, XCircle, Code, Cpu, ShieldCheck } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor'; // <--- Imported custom component

const Gate2_Coding = () => {
    const [code, setCode] = useState("// Write your solution here...\n\nfunction reverseString(str) {\n  return str;\n}");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRunCode = async () => {
        setLoading(true);
        try {
            // Call AI Compiler Backend
            const response = await candidateAPI.submitCode(1, code, 'javascript');
            setResult(response.data); // Expects { status: "PASS", score: 20, feedback: "..." }

            if (response.data.status === "PASS") {
                setTimeout(() => navigate('/candidate/gate-3'), 3000);
            }
        } catch (error) {
            setResult({ status: "ERROR", feedback: "Compilation Failed or Server Error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* LEFT PANEL: Problem Description */}
            <div className="w-1/3 flex flex-col bg-white border-r border-gray-200 shadow-xl z-10">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-accent">
                            <Code size={20} />
                        </div>
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Gate 2: Coding Challenge</span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Problem: Reverse a String</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p>Write a function that reverses a string. The input string is given as an array of characters.</p>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 my-4">
                            <h4 className="text-sm font-bold text-primary mb-2">Example 1:</h4>
                            <code className="block bg-white p-3 rounded-lg border border-gray-100 text-sm font-mono text-gray-700">
                                Input: s = "hello"<br />Output: "olleh"
                            </code>
                        </div>

                        <h4 className="text-sm font-bold text-primary mt-6 mb-2">Constraints:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Time Complexity: <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">O(N)</code></li>
                            <li>Space Complexity: <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">O(1)</code></li>
                        </ul>
                    </div>

                    {/* Result Console */}
                    {result && (
                        <div className={`mt-6 p-5 rounded-xl border ${result.status === 'PASS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fade-in-up`}>
                            <div className="flex items-center gap-2 mb-2">
                                {result.status === 'PASS' ? <CheckCircle className="text-green-600" size={20} /> : <XCircle className="text-red-600" size={20} />}
                                <strong className={`text-lg ${result.status === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.status}
                                </strong>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-transparent">{result.feedback}</p>
                            {result.status === 'PASS' && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Redirecting to AI Interview...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={handleRunCode}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <>
                                <Cpu size={20} className="animate-spin" /> Compiling...
                            </>
                        ) : (
                            <>
                                <Play size={20} className="fill-current" /> Run & Submit Solution
                            </>
                        )}
                    </button>
                    {!loading && <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1"><ShieldCheck size={12} /> AI Proctoring Active</p>}
                </div>
            </div>

            {/* RIGHT PANEL: Code Editor */}
            <div className="w-2/3 h-full bg-[#1e1e1e]"> {/* Keep editor bg dark for contrast */}
                {/* Using your new modular component */}
                <CodeEditor
                    code={code}
                    setCode={setCode}
                    language="javascript"
                />
            </div>
        </div>
    );
};

export default Gate2_Coding;