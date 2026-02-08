import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Maximize2, Flag, Shield } from 'lucide-react';

const Gate1_Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isFullscreen, setIsFullscreen] = useState(false);
    const navigate = useNavigate();

    // Mock Application ID for now (In real app, get from Context/URL)
    const applicationId = "123";

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // For demo, we might want to mock if backend is not fully ready with AI
                // const res = await candidateAPI.getQuiz(applicationId);
                // setQuestions(res.data.questions);

                // Fallback Mock Data for UI Dev
                setTimeout(() => {
                    setQuestions([
                        {
                            id: 1,
                            text: "Which of the following is NOT a React Hook?",
                            options: ["useState", "useEffect", "useRedux", "useCallback"],
                            correct: "useRedux"
                        },
                        {
                            id: 2,
                            text: "What is the time complexity of searching in a Hash Map?",
                            options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
                            correct: "O(1)"
                        },
                        {
                            id: 3,
                            text: "In Python, which keyword is used to start a function?",
                            options: ["func", "def", "function", "define"],
                            correct: "def"
                        }
                    ]);
                    setLoading(false);
                }, 1500);
            } catch (error) {
                console.error("Failed to load quiz", error);
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!loading && timeLeft > 0 && !score) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, loading, score]);

    const handleAnswer = (option) => {
        setAnswers({ ...answers, [currentQuestion]: option });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correct) correctCount++;
        });
        return Math.round((correctCount / questions.length) * 100);
    };

    const handleSubmit = async () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        try {
            await candidateAPI.submitQuiz(applicationId, finalScore);
        } catch (err) {
            console.error("Submission failed", err);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center font-sans">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-accent rounded-full animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Generating your assessment...</h2>
                <p className="text-slate-500 mt-2 max-w-md">Our AI is analyzing the job description to tailor questions specifically for this role.</p>
            </div>
        );
    }

    if (score !== null) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center border border-slate-100"
                >
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${score >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {score >= 70 ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{score >= 70 ? 'Assessment Passed' : 'Assessment Failed'}</h2>
                    <p className="text-slate-500 mb-8">You scored <span className="font-bold text-slate-900">{score}%</span> on this evaluation.</p>

                    {score >= 70 ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                                Great job! You've demonstrated strong knowledge foundation. Proceed to the coding challenge.
                            </p>
                            <button
                                onClick={() => navigate('/candidate/gate-2')}
                                className="w-full btn-primary py-4 text-lg shadow-green-200"
                            >
                                Proceed to Gate 2 <ChevronRight />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full btn-secondary py-4"
                        >
                            Retry Assessment
                        </button>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            {/* Proctoring Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-600" /> PROCTORED
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <span className="text-slate-500 font-medium text-sm">Gate 1: Knowledge Check</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <Maximize2 size={20} />
                    </button>
                </div>
            </header>

            {/* Quiz Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-8 flex flex-col justify-center">

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completed</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 md:p-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
                            {questions[currentQuestion].text}
                        </h2>

                        <div className="space-y-4">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${answers[currentQuestion] === option
                                            ? 'border-accent bg-accent/5 shadow-md'
                                            : 'border-slate-100 hover:border-accent/50 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className={`text-lg font-medium ${answers[currentQuestion] === option ? 'text-accent' : 'text-slate-700'}`}>
                                        {option}
                                    </span>
                                    {answers[currentQuestion] === option && (
                                        <CheckCircle className="text-accent" size={24} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Controls */}
                <div className="flex justify-between mt-10">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="btn-secondary px-6 disabled:opacity-50"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!answers[currentQuestion]}
                            className="btn-primary bg-green-600 hover:bg-green-700 shadow-green-200 px-8"
                        >
                            Submit Assessment <Shield size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={!answers[currentQuestion]}
                            className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Question <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Gate1_Quiz;