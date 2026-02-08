import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, User, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLanding = location.pathname === '/';

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Logo & Links */}
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/30 transition-transform group-hover:scale-105 group-hover:rotate-3">
                                <Bot className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-display font-bold tracking-tight text-primary">
                                HireLens
                            </span>
                        </Link>

                        {/* Desktop Links (Moved Here) */}
                        <div className="hidden md:flex items-center gap-8">
                            {!user && (
                                <>
                                    <a href="#features" className="text-sm font-medium text-slate-600 hover:text-accent transition-colors">Features</a>
                                    <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-accent transition-colors">How it works</a>
                                    <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-accent transition-colors">Testimonials</a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200">
                                    <div className={`w-2 h-2 rounded-full ${user.role === 'HR' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                                    <span className="text-sm font-semibold text-slate-700">
                                        {user.role}
                                    </span>
                                </div>
                                {user.role === 'HR' && (
                                    <Link to="/hr/create-job" className="hidden md:flex items-center gap-2 btn-primary py-2 px-4 text-xs">
                                        <Bot size={16} /> Create Job Agent
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium px-3 py-2 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-primary font-medium text-sm transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary flex items-center gap-2"
                                >
                                    Get Started <ChevronRight size={16} />
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-600 hover:text-primary p-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-4 animate-fade-in-up">
                        {!user && (
                            <>
                                <a href="#features" className="block py-2 text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                                <a href="#how-it-works" className="block py-2 text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                                <hr className="border-gray-100" />
                                <Link to="/login" className="block py-2 text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-primary text-center justify-center w-full" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                            </>
                        )}
                        {user && (
                            <button
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                className="flex items-center gap-2 text-red-500 font-medium py-2"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        )}
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;