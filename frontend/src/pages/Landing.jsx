import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Cpu, ShieldCheck, UserCheck, CheckCircle, BarChart3, Play, Activity, Globe, Zap } from 'lucide-react';
import aiRecruiter from '../assets/ai_recruiter_matte.png';
import dashboardClean from '../assets/dashboard_clean.png';

const Landing = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const op1 = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="min-h-screen bg-background font-sans overflow-x-hidden">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar Placeholder (Navbar is fixed, this pushes content down) */}
            <div className="h-20" />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-accent text-xs font-bold tracking-wide mb-8 uppercase"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            AI-Powered Recruitment Engine 2.0
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl lg:text-7xl font-bold leading-tight text-primary tracking-tight mb-6"
                        >
                            Hire the Top 1% <br />
                            <span className="text-gradient">Autonomously.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Replace manual screening with our 5-Gate AI pipeline.
                            From sourcing to final interview, HireLens handles the heavy lifting so you can focus on closing.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                                Start Hiring Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="btn-secondary flex items-center gap-2 px-8 py-4 text-lg">
                                <Play className="w-5 h-5 fill-current" /> Watch Demo
                            </button>
                        </motion.div>
                    </div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="relative max-w-5xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
                        <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm p-2">
                            <img
                                src={dashboardClean}
                                alt="Dashboard Preview"
                                className="w-full rounded-xl border border-slate-100 shadow-inner"
                            />

                            {/* Floating Badges */}
                            <div className="absolute top-10 -right-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                                        <p className="font-bold text-slate-800">Candidate Hired</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-20 -left-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <BarChart3 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Efficiency</p>
                                        <p className="font-bold text-slate-800">+450% Boost</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Partner Logos */}
            <section className="py-10 border-y border-slate-100 bg-white/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted by Engineering Teams at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Acme Corp', 'GlobalTech', 'Nebula', 'Velocity', 'Trio', 'FoxRun'].map(brand => (
                            <span key={brand} className="text-xl font-bold text-slate-400 hover:text-primary cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase">Why HireLens?</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">The 5-Gate Autonomous Pipeline</h2>
                        <p className="text-xl text-slate-500 max-w-2xl">
                            Our AI agents rigorously vet candidates through five distinct stages, ensuring only the most qualified talent reaches your final review.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <UserCheck />,
                                title: "Gate 1: AI Proctoring",
                                desc: "Advanced anti-cheating mechanisms detect tab switching, multiple monitors, and unauthorized device usage during initial screening."
                            },
                            {
                                icon: <Code />,
                                title: "Gate 2: Code Synthesis",
                                desc: "Real-time IDE where candidates solve problems. The AI compiles code, checks time complexity, and enforces best practices immediately."
                            },
                            {
                                icon: <Bot />,
                                title: "Gate 3: Avatar Interview",
                                desc: "Candidates speak with a hyper-realistic 3D AI agent that asks deep technical questions tailored to the specific role and seniority."
                            },
                            {
                                icon: <ShieldCheck />,
                                title: "Gate 4: Culture Fit",
                                desc: "The AI agent shifts persona to assess soft skills, communication style, and alignment with your specific company values."
                            },
                            {
                                icon: <Activity />,
                                title: "Gate 5: Trust Score",
                                desc: "A final proprietary score (0-100) generated by cross-referencing Resume, LinkedIn, and Technical performance metrics."
                            },
                            {
                                icon: <Zap />,
                                title: "Instant Setup",
                                desc: "Upload any PDF (handbook, textbook), and our Agent instantly generates a complete, tailored assessment pipeline from it."
                            }
                        ].map((feature, i) => (
                            <FeatureCard key={i} index={i} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 bg-primary relative overflow-hidden text-white" id="how-it-works">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">From Job Post to Offer in Hours</h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Streamline your hiring process with our autonomous workflow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Upload Job", desc: "Share your JD or let our Agent generate one." },
                            { step: "02", title: "AI Sourcing", desc: "Agent scans profiles and invites best matches." },
                            { step: "03", title: "Auto Interview", desc: "Candidates take our 5-Gate AI assessment." },
                            { step: "04", title: "Hire Top 1%", desc: "Review the Trust Score & one-click offer." },
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="text-6xl font-bold text-white/5 mb-4 group-hover:text-accent/20 transition-colors">{item.step}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                                {i !== 3 && (
                                    <div className="hidden lg:block absolute top-8 right-0 w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent translate-x-1/2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8">Ready to modernize your hiring?</h2>
                    <p className="text-xl text-slate-500 mb-10">
                        Join 500+ engineering teams hiring better, faster, and fairer with HireLens.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                            Get Started for Free <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">No credit card required • 14-day free trial</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <Bot className="w-8 h-8 text-accent" />
                            <span className="text-2xl font-bold">HireLens</span>
                        </div>
                        <p className="text-slate-400 max-w-xs">
                            The world's first fully agentic recruitment platform.
                            Automating the future of work.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2024 HireLens Inc. All rights reserved.
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
        className="card-gradient p-8 group hover:border-accent/30 transition-all duration-300"
    >
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">
            {desc}
        </p>
    </motion.div>
);

export default Landing;
