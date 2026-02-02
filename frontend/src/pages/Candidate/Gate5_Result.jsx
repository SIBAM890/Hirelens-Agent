import React, { useState } from 'react';
import { candidateAPI } from '../../services/api';
import { Upload, FileText, CheckCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Gate5_Result = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            // Using Dummy App ID 1 for demo
            const response = await candidateAPI.finalizeProfile(1, formData);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            alert("Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neon-dark text-white p-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-4">
                Final Assessment
            </h1>
            <p className="text-gray-400 mb-12">Upload your resume to finalize your profile and receive your Trust Score.</p>

            {!result ? (
                /* UPLOAD STAGE */
                <div className="w-full max-w-xl bg-neon-surface p-8 rounded-2xl border border-gray-800 shadow-2xl">
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-neon-purple transition-colors mb-8">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-16 h-16 text-neon-blue mb-4" />
                            <span className="text-xl font-bold text-white">Upload Resume (PDF)</span>
                            <span className="text-sm text-gray-500 mt-2">AI will cross-check with LinkedIn & Interview Performance</span>
                            {file && <span className="text-green-400 mt-4 flex items-center gap-2 p-2 bg-green-900/20 rounded"><FileText size={16} /> {file.name}</span>}
                        </label>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="w-full bg-gradient-to-r from-neon-blue to-neon-purple py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(188,19,254,0.4)] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Analyzing Profile...' : 'Generate Trust Score'}
                    </button>
                </div>
            ) : (
                /* RESULT STAGE */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Score Card */}
                        <div className="bg-neon-surface p-8 rounded-2xl border border-neon-blue/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col items-center justify-center text-center">
                            <div className="w-40 h-40 rounded-full border-8 border-neon-blue flex items-center justify-center mb-6 shadow-[0_0_20px_#00f3ff]">
                                <span className="text-5xl font-bold text-white">{result.score}%</span>
                            </div>
                            <h2 className="text-2xl font-bold text-neon-blue mb-2">Trust Score</h2>
                            <p className="text-gray-400 text-sm">Calculated based on Resume, Code Compatibility, and Interview Sentiment.</p>

                            <div className={`mt-6 px-6 py-2 rounded-full font-bold text-lg ${result.recommendation === "Hire" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                Verdict: {result.recommendation}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="text-green-400" /> Key Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {(result.strengths || ["Technical Depth", "Clear Communication", "Problem Solving"]).map((s, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                            <div className="w-2 h-2 bg-neon-blue rounded-full" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-yellow-400" /> Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {(result.weaknesses || ["System Design Experience", "Framework specific knowledge"]).map((w, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full" /> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button className="text-gray-500 hover:text-white transition-colors">Download Detailed Report</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Gate5_Result;
