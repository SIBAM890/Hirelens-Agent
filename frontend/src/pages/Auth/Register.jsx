import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, ArrowRight, User, Building2, Briefcase, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialRole = searchParams.get('role')?.toUpperCase() === 'HR' ? 'HR' : 'CANDIDATE';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: initialRole
    });
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Only redirect AFTER auth state has fully loaded from localStorage
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'HR') navigate('/hr/dashboard', { replace: true });
            else navigate('/candidate/jobs', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Show nothing while auth is loading to prevent flash
    if (authLoading) return null;

    const isHR = formData.role === 'HR';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.register(formData);
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.detail || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">

            {/* Left: Dynamic Feature Showcase */}
            <motion.div
                className={`hidden lg:flex flex-col justify-center p-12 text-white relative overflow-hidden transition-colors duration-700 ${isHR ? 'bg-indigo-950' : 'bg-gray-900'}`}
            >
                {/* Animated Backgrounds */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isHR ? 'hr-bg' : 'cand-bg'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className={`absolute inset-0 bg-cover bg-center ${isHR ? "bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')]" : "bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')]"}`}
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent" />

                <div className="relative z-10 max-w-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isHR ? 'hr-content' : 'cand-content'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-5xl font-bold mb-6 tracking-tight">
                                {isHR ? "Hiring at Scale," : "Unlock Your Dream"} <br />
                                <span className={isHR ? "text-indigo-400" : "text-accent"}>
                                    {isHR ? "Simplified." : "Career Today."}
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                {isHR
                                    ? "Automate your entire recruitment pipeline. From sourcing to technical interviews, let our Agents handle the busy work."
                                    : "Prove your skills with our AI-driven assessments. Skip the resume black hole and get hired by top companies instantly."
                                }
                            </p>

                            {/* Feature Pills */}
                            <div className="space-y-4">
                                {(isHR
                                    ? ["Automated 5-Gate Screening", "Deep Technical Reports", "One-Click Offer Generation"]
                                    : ["Fair Skill Assessment", "Instant Feedback", "Direct Access to Recruiters"]
                                ).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isHR ? 'bg-indigo-500/20' : 'bg-blue-500/20'}`}>
                                            <CheckCircle className={`w-4 h-4 ${isHR ? 'text-indigo-400' : 'text-blue-400'}`} />
                                        </div>
                                        <span className="font-medium text-gray-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Right: Register Form */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-gray-50/50 relative">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">HireLens</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                        <p className="text-gray-500">
                            {isHR ? "Start streamlining your hiring process." : "Join thousands of developers getting hired."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Switcher */}
                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-200/50 rounded-2xl relative">
                            {/* Sliding Background for Switcher could go here, but simple active state is safer for now */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                                className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${!isHR ? 'bg-white text-primary shadow-lg shadow-gray-200 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <User className={`w-4 h-4 ${!isHR ? 'text-accent' : ''}`} /> Candidate
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'HR' })}
                                className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isHR ? 'bg-white text-indigo-900 shadow-lg shadow-gray-200 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Briefcase className={`w-4 h-4 ${isHR ? 'text-indigo-600' : ''}`} /> HR Manager
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isHR ? 'hr-form' : 'cand-form'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        {isHR ? "Full Name" : "Username"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:ring-2 outline-none transition-all ${isHR ? 'focus:border-indigo-500 focus:ring-indigo-500/20' : 'focus:border-accent focus:ring-accent/20'}`}
                                        placeholder={isHR ? "Sarah Connor" : "johndoe123"}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Work Email</label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:ring-2 outline-none transition-all ${isHR ? 'focus:border-indigo-500 focus:ring-indigo-500/20' : 'focus:border-accent focus:ring-accent/20'}`}
                                        placeholder="name@company.com"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className={`w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:ring-2 outline-none transition-all ${isHR ? 'focus:border-indigo-500 focus:ring-indigo-500/20' : 'focus:border-accent focus:ring-accent/20'}`}
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            disabled={loading}
                            className={`w-full text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 ${isHR ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20' : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20'}`}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className={`font-semibold hover:underline ${isHR ? 'text-indigo-600' : 'text-accent'}`}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;