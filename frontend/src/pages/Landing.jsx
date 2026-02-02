import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Cpu, ShieldCheck, UserCheck, CheckCircle, BarChart3, Play } from 'lucide-react';
import aiRecruiter from '../assets/ai_recruiter_matte.png';
import dashboardClean from '../assets/dashboard_clean.png';

const Landing = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="min-h-screen bg-background text-primary font-sans overflow-x-hidden selection:bg-accent/20">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] mix-blend-multiply"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] mix-blend-multiply"
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                            <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">
                            HireLens
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#features" className="hover:text-accent transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-accent transition-colors">How it Works</a>
                            <a href="#testimonials" className="hover:text-accent transition-colors">Customers</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Log In</Link>
                            <Link to="/register" className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-wide mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            NEW: AI INTERVIEWER V2.0
                        </motion.div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-primary tracking-tight">
                            Hire the top 1% <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">
                                Autonomously.
                            </span>
                        </h1>

                        <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                            The world's first fully agentic recruitment platform.
                            From screening to technical interviews, HireLens handles the entire L1 & L2 pipeline so you can focus on closing.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="group px-8 py-4 bg-accent text-white rounded-xl font-semibold transition-all hover:bg-accent/90 shadow-xl shadow-accent/25 flex items-center gap-2 hover:translate-y-[-2px]">
                                Start Initial Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all hover:translate-y-[-2px]">
                                <Play className="w-4 h-4 fill-current" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200`} />
                                ))}
                            </div>
                            <p>Trusted by <span className="font-semibold text-primary">500+ Engineering Teams</span></p>
                        </div>
                    </motion.div>

                    {/* Right 3D Visual */}
                    <motion.div
                        style={{ y: y1 }}
                        className="relative h-[600px] flex items-center justify-center lg:justify-end perspective-1000"
                    >
                        <motion.img
                            src={aiRecruiter}
                            alt="AI Recruiter Agent"
                            className="relative z-10 w-full max-w-[500px] object-contain drop-shadow-2xl"
                            animate={{
                                y: [-15, 15, -15],
                                rotate: [0, 1, -1, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Floating Stats Cards */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute bottom-20 left-0 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-4 z-20"
                        >
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Success Rate</p>
                                <p className="text-xl font-bold text-primary">98.5%</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute top-32 right-0 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-4 z-20"
                        >
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Screened</p>
                                <p className="text-lg font-bold text-primary">12,450+</p>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white relative z-10" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-primary font-bold text-3xl lg:text-4xl mb-4"
                        >
                            The Autonomous Hiring Pipeline
                        </motion.h2>
                        <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
                        <p className="text-gray-500">
                            Replace manual screening with our 5-Gate AI verification capability.
                            Ensure only top-tier talent reaches your team.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <UserCheck />, title: "Gate 1: AI Proctoring", desc: "Advanced anti-cheating mechanisms detect tab switching, multiple monitoring, and unauthorized device usage." },
                            { icon: <Code />, title: "Gate 2: Code Synthesis", desc: "A real-time IDE where candidates solve problems. The AI compiles code, checks time complexity, and enforces best practices." },
                            { icon: <Bot />, title: "Gate 3: Avatar Interview", desc: "Candidates speak with a hyper-realistic 3D AI agent that asks deep technical questions tailored to the specific role." },
                            { icon: <ShieldCheck />, title: "Gate 4: Culture Fit", desc: "The AI agent shifts persona to assess soft skills, communication style, and alignment with your company values." },
                            { icon: <BarChart3 />, title: "Gate 5: Trust Score", desc: "A final proprietary score (0-100) generated by cross-referencing Resume, LinkedIn, and Technical performance." },
                            { icon: <Cpu />, title: "Instant Generation", desc: "Upload any PDF (handbook, textbook), and our Agent instantly generates a complete assessment pipeline from it." }
                        ].map((feature, i) => (
                            <FeatureCard key={i} index={i} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Animated Workflow Section */}
            <section className="py-24 bg-gray-50 overflow-hidden" id="how-it-works">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-accent font-bold tracking-wider text-sm uppercase"
                        >
                            Seamless Process
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl lg:text-5xl font-bold text-primary mt-2"
                        >
                            From Job Post to Offer in <span className="text-accent">Hours</span>
                        </motion.h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-[60px] left-0 w-full h-1 bg-gray-200">
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-full bg-accent"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                            {[
                                { step: "01", title: "Upload Job", desc: "Share your JD or let our Agent generate one for you.", icon: <Code className="w-6 h-6 text-white" /> },
                                { step: "02", title: "AI Sourcing", desc: "Agent scans 1000+ profiles and invites best matches.", icon: <UserCheck className="w-6 h-6 text-white" /> },
                                { step: "03", title: "Autonomous Interview", desc: "Candidates take our 5-Gate AI technical assessment.", icon: <Bot className="w-6 h-6 text-white" /> },
                                { step: "04", title: "Hire Top 1%", desc: "Review the Trust Score & deep reports. One-click offer.", icon: <ShieldCheck className="w-6 h-6 text-white" /> },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (i * 0.2) }}
                                    className="relative flex flex-col items-center text-center"
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary border-4 border-white shadow-xl flex items-center justify-center mb-6 z-10 relative">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                                            {item.step}
                                        </div>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (Dashboard Preview) */}
            <section className="py-24 bg-gray-50 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        style={{ y: y2 }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl transform scale-150" />
                        <img
                            src={dashboardClean}
                            alt="HireLens Dashboard"
                            className="relative z-10 rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-200 transform hover:scale-[1.02] transition-transform duration-700"
                        />
                    </motion.div>
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-3xl font-bold text-primary mb-6">A Dashboard Designed for Decisions</h3>
                            <p className="text-gray-500 mb-8">
                                Stop drowning in resumes. Our dashboard gives you a "God View" of your pipeline.
                                Filter by Trust Score, watch interview replays, or one-click hire.
                            </p>
                            <div className="space-y-4">
                                <CheckItem text="Real-time candidate tracking" delay={0.1} />
                                <CheckItem text="Automated rejection/offer emails" delay={0.2} />
                                <CheckItem text="Deep-dive technical reports" delay={0.3} />
                                <CheckItem text="Integration with Slack & Jira" delay={0.4} />
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-lg font-semibold text-primary hover:bg-gray-50 transition-colors"
                        >
                            Explore Dashboard
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-accent" />
                        <span className="font-bold text-primary">HireLens</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2024 HireLens Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-primary">Privacy</a>
                        <a href="#" className="hover:text-primary">Terms</a>
                        <a href="#" className="hover:text-primary">Contact</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

const FeatureCard = ({ icon, title, desc, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -10 }}
        className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:bg-white transition-all cursor-default group"
    >
        <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">
            {desc}
        </p>
    </motion.div>
);

const CheckItem = ({ text, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay, duration: 0.5 }}
        className="flex items-center gap-3"
    >
        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-3 h-3 text-accent" />
        </div>
        <span className="text-gray-600 font-medium">{text}</span>
    </motion.div>
)

export default Landing;
