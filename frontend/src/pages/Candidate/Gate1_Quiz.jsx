import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import { AlertTriangle } from 'lucide-react';

const Gate1_Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const applicationId = location.state?.applicationId;

    const [started, setStarted] = useState(false);
    const [warnings, setWarnings] = useState(0);
    const [score, setScore] = useState(0);
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

    const handleSubmit = async () => {
        // Assume 20 is passing
        if (score >= 20) {
            if (!applicationId) {
                alert("Error: No Application ID found. Please go back to Job Board.");
                return;
            }
            await candidateAPI.submitQuiz(applicationId, score);
            navigate('/candidate/gate-2', { state: { applicationId } }); // Pass ID to next gate
        } else {
            alert("Score too low. Try again.");
        }
    };

    if (!started) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Gate 1: Speed & Accuracy</h1>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        This test is proctored. Fullscreen is enforced.
                        Tab switching will trigger warnings. 3 warnings = Disqualification.
                    </p>
                    <button
                        onClick={handleStart}
                        className="bg-neon-blue text-black px-8 py-3 rounded-full font-bold text-lg hover:shadow-[0_0_20px_#00f3ff] transition-all"
                    >
                        Start Assessment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-10">
            {/* Proctoring Alert */}
            {warnings > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded flex items-center gap-2 animate-pulse">
                    <AlertTriangle /> Warning: {warnings}/3 Tab Switches
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Gate 1: Aptitude Assessment</h2>
            {/* Quiz UI Skeleton */}
            <div className="bg-neon-surface p-6 rounded-lg border border-gray-800">
                <p className="mb-4 text-lg">Question 1: What is the output of 2 + '2' in JavaScript?</p>
                <div className="space-y-3">
                    {['4', '22', 'NaN', 'Error'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setScore(prev => prev + 5)} // Dummy scoring logic
                            className="block w-full text-left p-3 rounded bg-gray-800 hover:bg-neon-purple/20 border border-gray-700 hover:border-neon-purple transition-all"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={handleSubmit} className="mt-8 bg-neon-blue text-black px-6 py-2 rounded font-bold">
                Submit Quiz
            </button>
        </div>
    );
};

export default Gate1_Quiz;