import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                            <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">
                            HireLens
                        </span>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <span className="hidden md:flex text-gray-600 text-sm items-center gap-2 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                    <User size={14} className="text-accent" /> {user.role}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                                >
                                    <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary transition-colors font-medium text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;