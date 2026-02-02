import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, User, Building2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CANDIDATE' // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">

            {/* Left: Feature Showcase (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center bg-gray-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-6">Join the Future of Hiring</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Whether you're a recruiter looking to automate or a candidate ready to prove your skills, HireLens is your platform.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                            <User className="w-8 h-8 text-accent mb-3" />
                            <h3 className="font-bold">For Candidates</h3>
                            <p className="text-sm text-gray-500">Showcase skills, not just resumes.</p>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                            <Building2 className="w-8 h-8 text-blue-400 mb-3" />
                            <h3 className="font-bold">For HR Teams</h3>
                            <p className="text-sm text-gray-500">Automate screening & interviews.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Register Form */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-gray-50/50">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">HireLens</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                        <p className="text-gray-500">Start your journey with us today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                                className={`py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'CANDIDATE' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Candidate
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'HR' })}
                                className={`py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'HR' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                HR Manager
                            </button>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="name@company.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;