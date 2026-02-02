import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import { Play, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
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
        <div className="flex h-screen bg-[#121212] overflow-hidden">
            {/* LEFT PANEL: Problem Description */}
            <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col bg-[#1a1a1a]">
                <div className="flex-1 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Problem: Reverse a String</h2>
                    <div className="prose prose-invert text-gray-300">
                        <p>Write a function that reverses a string. The input string is given as an array of characters.</p>
                        <h4 className="text-neon-blue mt-4">Example 1:</h4>
                        <pre className="bg-black p-3 rounded text-sm">Input: s = "hello"<br />Output: "olleh"</pre>
                        <h4 className="text-neon-blue mt-4">Constraints:</h4>
                        <ul className="list-disc pl-5">
                            <li>Time Complexity: O(N)</li>
                            <li>Space Complexity: O(1)</li>
                        </ul>
                    </div>

                    {/* Result Console */}
                    {result && (
                        <div className={`mt-6 p-4 rounded-lg border ${result.status === 'PASS' ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {result.status === 'PASS' ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
                                <strong className={result.status === 'PASS' ? 'text-green-400' : 'text-red-400'}>
                                    {result.status}
                                </strong>
                            </div>
                            <p className="text-sm text-gray-300">{result.feedback}</p>
                            {result.status === 'PASS' && <p className="text-xs text-green-300 mt-2">Redirecting to Interview...</p>}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-gray-700">
                    <button
                        onClick={handleRunCode}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                        {loading ? 'Compiling...' : <><Play size={18} /> Run & Submit</>}
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: Code Editor */}
            <div className="w-2/3 h-full">
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