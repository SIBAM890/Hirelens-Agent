import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, ShieldCheck, UserCheck, BarChart3, Play, Zap, Check, Star } from 'lucide-react';
import aiRecruiter from '../assets/ai_recruiter_matte.svg';
import dashboardClean from '../assets/dashboard_clean.svg';
import logo from '../assets/HireLens.png';

const Landing = () => {
    const { scrollY } = useScroll();
    const heroRef = useRef(null);

    // Parallax Effects
    const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
    const opHero = useTransform(scrollY, [0, 500], [1, 0]);
    const yFeatures = useTransform(scrollY, [300, 1000], [100, 0]);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-accent/20 selection:text-accent">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Navigation (Floating Glass) */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass px-8 py-4 rounded-full flex items-center justify-between w-full max-w-6xl shadow-2xl shadow-blue-900/5 backdrop-blur-xl border border-white/40"
                >
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="HireLens Logo" className="w-9 h-9 object-contain" />
                        <span className="font-bold text-xl tracking-tight text-slate-800 font-display">HireLens<span className="text-accent">.</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                        {['Features', 'How it Works', 'Pricing', 'Enterprise'].map((item) => (
                            <NavLink key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}>
                                {item}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Box 1: Roles */}
                        <div className="hidden md:flex items-center bg-slate-100/80 backdrop-blur-sm p-1 rounded-full border border-slate-200">
                            <Link to="/register?role=HR" className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm rounded-full transition-all">Employer</Link>
                            <Link to="/register?role=CANDIDATE" className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm rounded-full transition-all">Candidate</Link>
                        </div>

                        {/* Box 2: Auth */}
                        <div className="flex items-center bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                            <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/20 transition-all">Sign Up</Link>
                        </div>
                    </div>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-44 pb-32 px-6 z-10">
                <div className="max-w-7xl mx-auto text-center relative">
                    <motion.div
                        style={{ y: yHero, opacity: opHero }}
                        className="relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-8 shadow-sm hover:shadow-md transition-all cursor-default"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>v2.0 Now Live: Autonomous Coding Interviews</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="heading-xl text-slate-900 mb-8 max-w-4xl mx-auto"
                        >
                            Hire Engineering Talent <br />
                            <span className="text-gradient">On Autopilot.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            The world's first AI recruiter that sources, screens, and interviews candidates autonomously.
                            <span className="text-slate-900 font-medium"> Turn weeks of hiring into hours.</span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                        >
                            <Link to="/register?role=HR" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto hover:scale-105">
                                Start Hiring for Free <ArrowRight size={20} />
                            </Link>
                            <button
                                onClick={() => alert("Demo video coming soon!")}
                                className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto hover:bg-slate-50"
                            >
                                <Play size={20} className="fill-slate-700" /> Watch Demo
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* 3D Tilt Dashboard Preview */}
                    <TiltCard>
                        <div className="relative rounded-2xl border border-slate-200 shadow-2xl bg-white/50 backdrop-blur-sm p-3 mx-auto max-w-5xl group">
                            <img src={dashboardClean} alt="Dashboard" className="w-full h-auto rounded-xl shadow-inner border border-slate-100" />

                            {/* Floating Stats */}
                            <motion.div
                                className="absolute -top-10 -right-10 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden lg:block"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <UserCheck className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Saved</p>
                                        <h3 className="text-2xl font-bold text-slate-800">120 hrs</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 -left-10 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden lg:block"
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <BarChart3 className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality of Hire</p>
                                        <h3 className="text-2xl font-bold text-slate-800 text-gradient">Top 1%</h3>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </TiltCard>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-12 border-y border-slate-200 bg-white/50">
                <div className="page-container flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Trusted by innovators at</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0 cursor-default">
                        {['Airbnb', 'Linear', 'Vercel', 'Notion', 'Stripe'].map(brand => (
                            <span key={brand} className="text-2xl font-bold font-display text-slate-800">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative overflow-hidden bg-slate-50" id="features">
                <div className="page-container relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-accent font-bold tracking-widest text-sm uppercase">Why HireLens?</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">The 5-Gate Autonomous Pipeline</h2>
                        <p className="text-xl text-slate-500">
                            Our AI agents rigorously vet candidates through five distinct stages, ensuring only the most qualified talent reaches your final review.
                        </p>
                    </div>

                    <motion.div
                        style={{ y: yFeatures }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, i) => (
                            <FeatureCard key={i} index={i} {...feature} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 bg-white" id="how-it-works">
                <div className="page-container">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide">
                                <Zap size={14} className="fill-blue-600" /> FAST & EFFICIENT
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Seamless Integration into your existing workflow.</h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                HireLens connects directly with your ATS. Create a job agent in seconds by pasting a JD URL. The agent handles everything from outreach to scheduling final interviews.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "One-click Job Agent deployment",
                                    "Automated candidate sourcing from LinkedIn",
                                    "24/7 AI Interviews & Technical Assessments",
                                    "Instant Ranking & Detailed Reports"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="bg-green-100 p-1 rounded-full">
                                            <Check size={16} className="text-green-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1">
                            <img src={aiRecruiter} alt="How It Works" className="w-full rounded-2xl shadow-2xl skew-y-1 transform border border-slate-100" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-32 bg-slate-50" id="pricing">
                <div className="page-container text-center max-w-4xl">
                    <span className="text-accent font-bold tracking-widest text-sm uppercase">Pricing</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-slate-500 mb-16">Stop paying per-seat. Start paying for performance.</p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {/* Starter */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-4">$0</div>
                            <p className="text-slate-500 text-sm mb-6">Perfect for trying out autonomous hiring.</p>
                            <Link to="/register?plan=starter" className="w-full btn-secondary mb-8 block text-center">Get Started</Link>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> 1 Active Job Agent</li>
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> 50 Candidates/mo</li>
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> Basic Reporting</li>
                            </ul>
                        </div>

                        {/* Pro */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                            <h3 className="text-xl font-bold mb-2">Growth</h3>
                            <div className="text-4xl font-bold mb-4">$499<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                            <p className="text-slate-400 text-sm mb-6">For scaling teams hiring consistently.</p>
                            <Link to="/register?plan=growth" className="w-full btn-primary mb-8 shadow-none bg-white text-slate-900 hover:bg-slate-100 block text-center">Start Free Trial</Link>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-2"><Check size={16} className="text-accent" /> Unlimited Job Agents</li>
                                <li className="flex gap-2"><Check size={16} className="text-accent" /> 1,000 Candidates/mo</li>
                                <li className="flex gap-2"><Check size={16} className="text-accent" /> Advanced AI Screening</li>
                                <li className="flex gap-2"><Check size={16} className="text-accent" /> Dedicated Success Manager</li>
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all" id="enterprise">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-4">Custom</div>
                            <p className="text-slate-500 text-sm mb-6">Full control & security for large orgs.</p>
                            <a href="mailto:sales@hirelens.com" className="w-full btn-secondary mb-8 block text-center">Contact Sales</a>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> Custom Integrations</li>
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> SSO & Audit Logs</li>
                                <li className="flex gap-2"><Check size={16} className="text-green-500" /> SLA Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer - Modified to work with links */}
            <footer className="bg-white border-t border-slate-200 py-16">
                <div className="page-container grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="HireLens" className="w-8 h-8" />
                            <span className="text-xl font-bold text-slate-900">HireLens</span>
                        </div>
                        <p className="text-slate-500 max-w-xs leading-relaxed">
                            Building the future of autonomous recruitment. <br />
                            San Francisco, CA.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-slate-500">
                            <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-accent transition-colors">Pricing</a></li>
                            <li><a href="#enterprise" className="hover:text-accent transition-colors">Enterprise</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-slate-500">
                            <li className="hover:text-accent cursor-pointer transition-colors">About</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="page-container mt-16 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                    © 2024 HireLens Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

// Animated Nav Link Component
const NavLink = ({ href, children }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <a
            href={href}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
            {children}
            {isHovered && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white shadow-sm rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </a>
    );
}

// 3D Tilt Component
const TiltCard = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative perspective-1000"
        >
            {children}
        </motion.div>
    );
}

const FeatureCard = ({ icon, title, desc, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className="group relative border border-slate-200 bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300"
            onMouseMove={onMouseMove}
        >
            {/* Hover Glow Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                    radial-gradient(
                      650px circle at ${mouseX}px ${mouseY}px,
                      rgba(79, 70, 229, 0.05),
                      transparent 80%
                    )
                  `,
                }}
            />

            <div className="relative flex flex-col items-start gap-4">
                <div className="p-3 bg-slate-50 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
                </div>
            </div>
        </div>
    );
}

const features = [
    {
        icon: <UserCheck size={28} />,
        title: "Gate 1: AI Proctoring",
        desc: "Advanced anti-cheating mechanisms detect tab switching, multiple monitors, and unauthorized device usage during initial screening."
    },
    {
        icon: <Code size={28} />,
        title: "Gate 2: Code Synthesis",
        desc: "Real-time IDE where candidates solve problems. The AI compiles code, checks time complexity, and enforces best practices immediately."
    },
    {
        icon: <Bot size={28} />,
        title: "Gate 3: Avatar Interview",
        desc: "Candidates speak with a hyper-realistic 3D AI agent that asks deep technical questions tailored to the specific role and seniority."
    },
    {
        icon: <ShieldCheck size={28} />,
        title: "Gate 4: Culture Fit",
        desc: "The AI agent shifts persona to assess soft skills, communication style, and alignment with your specific company values."
    },
    {
        icon: <Zap size={28} />,
        title: "Gate 5: Trust Score",
        desc: "A final proprietary score (0-100) generated by cross-referencing Resume, LinkedIn, and Technical performance metrics."
    },
    {
        icon: <Star size={28} />,
        title: "Instant Ranking",
        desc: "Candidates are automatically ranked on your dashboard. Filter by technical skill, communication score, or overall fit."
    }
];

export default Landing;
