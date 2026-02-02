import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.login(formData);
            login(data.token, data.role, data.user_id);
            // Redirect based on role
            if (data.role === 'HR') navigate('/hr/dashboard');
            else navigate('/candidate/jobs');
        } catch (err) {
            alert(err.response?.data?.detail || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">

            {/* Left: Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">HireLens</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Enter your credentials to access the workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="name@company.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-accent hover:underline font-medium">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm">
                        Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>

            {/* Right: Feature Showcase (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 mt-auto">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                        <Bot className="w-6 h-6 text-accent" />
                    </div>
                    <blockquote className="text-2xl font-medium leading-relaxed mb-6">
                        "HireLens reduced our time-to-hire by 80%. The AI interviews are surprisingly indistinguishable from human screening."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div>
                            <div className="font-bold">Sarah Chen</div>
                            <div className="text-sm text-gray-400">Head of Talent, TechFlow</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> AI-Powered Code Analysis
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> Automated Proctoring
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> Bias-Free Scoring
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;