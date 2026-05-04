import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, User, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const { login, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Only redirect AFTER auth state has fully loaded from localStorage
    React.useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'HR') navigate('/hr/dashboard', { replace: true });
            else navigate('/candidate/jobs', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Show nothing while auth is loading to prevent flash
    if (authLoading) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            const user = JSON.parse(localStorage.getItem('user'));

            setNotification({ type: 'success', message: 'Welcome back!' });
            setTimeout(() => {
                if (user.role === 'HR') navigate('/hr/dashboard');
                else navigate('/candidate/jobs');
            }, 1000);

        } catch (err) {
            setNotification({ type: 'error', message: 'Invalid credentials. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden font-inter">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200 mb-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Bot className="text-primary w-8 h-8" />
                            </div>
                            <span className="font-bold text-xl text-slate-800">Why HireLens?</span>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "AI-Powered Candidate Screening",
                                "Automated Technical Interviews",
                                "Real-time Skill Assessment",
                                "Unbiased Hiring Decisions"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 mb-8 hover:text-primary transition-colors">
                            <Bot className="w-6 h-6" />
                            <span className="font-bold text-xl tracking-tight">HireLens</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Fields */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 outline-none"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 outline-none"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-primary hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 z-50 ${notification.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
