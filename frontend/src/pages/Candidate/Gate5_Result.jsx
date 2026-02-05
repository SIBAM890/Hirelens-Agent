import React, { useState } from 'react';
import { candidateAPI } from '../../services/api';
import { Upload, FileText, CheckCircle, ShieldCheck, AlertTriangle, Download, Award } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10 flex flex-col items-center justify-center font-sans">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
                    <Award className="text-primary w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
                    Final Assessment
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto">Upload your resume to finalize your profile. Our agents will cross-reference it with your interview performance to generate your HireScore™.</p>
            </div>

            {!result ? (
                /* UPLOAD STAGE */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
                >
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-accent hover:bg-blue-50/30 transition-all duration-300 mb-8 file-drop-zone group">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={28} />
                            </div>
                            <span className="text-xl font-bold text-gray-800 mb-1">Upload Resume (PDF)</span>
                            <span className="text-sm text-gray-400">Drag & drop or click to browse files</span>

                            {file && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-6 flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100"
                                >
                                    <FileText size={18} />
                                    <span className="font-medium text-sm">{file.name}</span>
                                    <CheckCircle size={16} className="ml-2" />
                                </motion.div>
                            )}
                        </label>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing Profile...' : 'Generate Trust Score'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Secure AI Analysis
                    </p>
                </motion.div>
            ) : (
                /* RESULT STAGE */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-5xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Score Card */}
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Award size={200} />
                            </div>

                            <div className="relative mb-6">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="transparent"
                                        stroke="#f3f4f6"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="transparent"
                                        stroke={result.score >= 70 ? "#4f46e5" : "#eab308"}
                                        strokeWidth="12"
                                        strokeDasharray={2 * Math.PI * 88}
                                        strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold text-primary">{result.score}%</span>
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">Trust Score</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete</h2>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Calculated based on Resume analysis, Code Compatibility, and Interview Sentiment.</p>

                            <div className={`px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 ${result.recommendation === "Hire" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {result.recommendation === "Hire" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                                Verdict: {result.recommendation}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/40">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShieldCheck size={20} /></div>
                                    Key Strengths
                                </h3>
                                <ul className="space-y-4">
                                    {(result.strengths || ["Technical Depth", "Clear Communication", "Problem Solving"]).map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full shrink-0" />
                                            <span className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 border border-gray-100 w-full">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/40">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><AlertTriangle size={20} /></div>
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-4">
                                    {(result.weaknesses || ["System Design Experience", "Framework specific knowledge"]).map((w, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <div className="mt-1.5 w-2 h-2 bg-yellow-500 rounded-full shrink-0" />
                                            <span className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 border border-gray-100 w-full">{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button className="flex items-center gap-2 mx-auto text-gray-500 hover:text-primary transition-colors font-medium text-sm group">
                            <Download size={16} className="group-hover:-translate-y-1 transition-transform" /> Download Detailed Candidate Report
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Gate5_Result;
