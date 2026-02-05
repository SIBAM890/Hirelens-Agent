import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import { AlertTriangle, Timer, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Gate1_Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const applicationId = location.state?.applicationId;

    const [started, setStarted] = useState(false);
    const [warnings, setWarnings] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { 0: "Option A", 1: "Option B" }

    // 🛡️ RECOVERY: If ID is lost (e.g. refresh), try to warn user
    useEffect(() => {
        if (!applicationId) {
            const confirm = window.confirm("Session Data Missing (Application ID). Return to Jobs?");
            if (confirm) navigate('/candidate/jobs');
        } else {
            // Fetch Quiz
            const fetchQuiz = async () => {
                try {
                    const res = await candidateAPI.getQuiz(applicationId);
                    if (res.data.questions && Array.isArray(res.data.questions)) {
                        setQuestions(res.data.questions);
                    }
                } catch (err) {
                    console.error("Failed to load quiz", err);
                    // Fallback/Retry logic could go here
                }
            };
            fetchQuiz();
        }
    }, [applicationId, navigate]);

    // 🕵️‍♂️ PROCTORING LOGIC
    useEffect(() => {
        if (!started) return;

        const handleVisibility = () => {
            if (document.hidden) {
                setWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert("Test Terminated due to suspicious activity.");
                        navigate('/candidate/fail');
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [started, navigate]);

    const handleStart = () => {
        setStarted(true);
        document.documentElement.requestFullscreen().catch((e) => console.log(e));
    };

    const handleSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion]: option
        }));
    };

    const handleSubmit = async () => {
        // Calculate Score
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) {
                correctCount++;
            }
        });

        // Normalize to 100
        const finalScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

        // Pass Logic (e.g. >= 40%)
        if (finalScore >= 40) {
            await candidateAPI.submitQuiz(applicationId, finalScore);
            navigate('/candidate/gate-2', { state: { applicationId } });
        } else {
            alert(`You scored ${finalScore.toFixed(0)}%. Passing is 40%. Please try again.`);
            // Ideally reset quiz or handle fail state
            setSelectedAnswers({});
            setCurrentQuestion(0);
        }
    };

    if (!started) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-primary p-8 text-center text-white relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Gate 1: Speed & Accuracy</h1>
                        <p className="text-white/80">Proctored Preliminary Assessment</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                            <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-orange-900 text-sm mb-1">Strict Proctoring Enabled</h3>
                                <p className="text-orange-700 text-sm leading-relaxed">
                                    Fullscreen mode is enforced. Tab switching or exiting full screen will allow up to <strong>3 warnings</strong> before automatic disqualification.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <CheckCircle size={20} className="text-green-500" />
                                <span>20 Multiple Choice Questions</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Timer size={20} className="text-blue-500" />
                                <span>15 Minutes Duration</span>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all transform active:scale-95"
                        >
                            Start Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10">
            {/* Proctoring Alert */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Gate 1: Aptitude Assessment</h2>

                {warnings > 0 && (
                    <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse text-red-700 font-bold shadow-sm">
                        <AlertTriangle size={18} /> Warning: {warnings}/3 Tab Switches
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Quiz UI Skeleton */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <div className="flex items-center gap-2 text-orange-600 font-mono font-medium bg-orange-50 px-3 py-1 rounded-full">
                            <Timer size={16} /> 14:32
                        </div>
                    </div>

                    {questions.length > 0 ? (
                        <>
                            <p className="mb-8 text-xl font-medium text-gray-800 leading-relaxed">
                                {questions[currentQuestion].question}
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {questions[currentQuestion].options.map((opt, idx) => {
                                    const isSelected = selectedAnswers[currentQuestion] === opt;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(opt)}
                                            className={`text-left p-6 rounded-xl border transition-all font-medium group relative overflow-hidden ${isSelected ? 'border-primary bg-blue-50 text-primary shadow-inner' : 'border-gray-200 hover:border-accent hover:bg-blue-50 text-gray-600'}`}
                                        >
                                            <span className={`w-6 h-6 rounded-full border inline-flex items-center justify-center mr-3 text-xs font-bold transition-colors ${isSelected ? 'border-primary text-primary' : 'border-gray-300 text-gray-400 group-hover:border-accent group-hover:text-accent'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {opt}
                                            {isSelected && (
                                                <motion.div layoutId="check" className="absolute top-6 right-6 text-primary">
                                                    <CheckCircle size={20} />
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p className="text-gray-500">Generating Assessment Questions...</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestion(curr => Math.max(0, curr - 1))}
                        disabled={currentQuestion === 0}
                        className="text-gray-500 font-medium hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500"
                    >
                        Previous
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(curr => curr + 1)}
                            disabled={!selectedAnswers[currentQuestion]}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(selectedAnswers).length < questions.length}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Assessment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gate1_Quiz;