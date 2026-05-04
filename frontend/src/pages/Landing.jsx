import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/HireLens.png';
import './LandingNew.css';

const Landing = () => {
    const observerRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        // Initialize elements with hidden state before observer
        const initializeElements = () => {
            document.querySelectorAll('.landing-new-wrapper .hero, .landing-new-wrapper .bento-section, .landing-new-wrapper .content-frame, .landing-new-wrapper .testimonial, .landing-new-wrapper .cta-banner').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'none';
            });

            document.querySelectorAll('.landing-new-wrapper .insight-card, .landing-new-wrapper .service-card, .landing-new-wrapper .stat-card, .landing-new-wrapper .bento-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'none';
            });
        };

        initializeElements();

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.animDelay) || 0;
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observerRef.current = observer;

        // Observe elements
        const sectionConfigs = [
            { selector: '.hero', delay: 0 },
            { selector: '.bento-section', delay: 50 },
            { selector: '.content-frame', delay: 50 },
            { selector: '.testimonial', delay: 50 },
            { selector: '.cta-banner', delay: 50 }
        ];

        sectionConfigs.forEach(config => {
            const el = document.querySelector(`.landing-new-wrapper ${config.selector}`);
            if (el) {
                el.dataset.animDelay = config.delay;
                observer.observe(el);
            }
        });

        const animateCardGroup = (selector) => {
            const cards = document.querySelectorAll(`.landing-new-wrapper ${selector}`);
            cards.forEach((card, index) => {
                card.dataset.animDelay = index * 80;
                observer.observe(card);
            });
        };

        animateCardGroup('.bento-card');
        animateCardGroup('.stat-card');
        animateCardGroup('.insight-card');
        animateCardGroup('.service-card');

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <div className="landing-new-wrapper">
            <header>
                <nav className="navbar">
                    <Link to="/" className="logo-container">
                        <img src={logo} alt="HireLens Logo" className="w-10 h-10 object-contain" />
                        <span className="logo-text">HireLens Agent</span>
                    </Link>
                    <ul className="nav-center">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#resources">Resources</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                    <div className="nav-right" style={{ display: 'flex', gap: '1rem' }}>
                        {user ? (
                            <Link to={user.role === 'HR' ? "/hr/dashboard" : "/candidate/jobs"} className="btn btn-secondary btn-nav">
                                <span>Go to Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Login</Link>
                                <Link to="/register?role=HR" className="btn btn-secondary btn-nav"><span>Start Hiring</span></Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <section className="hero" id="home">
                <div className="hero-inner">
                    <div className="hero-content">
                        <h1>Your AI Hiring Assistant for Instant Recruitment Clarity</h1>
                        <p>Stop drowning in resumes and manual interviews. HireLens transforms complex candidate evaluation into simple, actionable insights—in seconds, not weeks.</p>
                        <Link to="/register?role=HR" className="btn btn-secondary btn-nav"><span>Hire Your First Candidate Free</span></Link>
                        <div className="social-proof">
                            <div className="proof-avatars">
                                <div className="avatar-stack">
                                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #FFB3E6, #FFF9B3)' }}></div>
                                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #D4F1D4, #FFB3E6)' }}></div>
                                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #FFF9B3, #D4F1D4)' }}></div>
                                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #FFB3E6, #D4F1D4)' }}></div>
                                    <div className="avatar avatar-count">100+</div>
                                </div>
                            </div>
                            <p className="proof-text">100+ HR professionals already trust HireLens</p>
                        </div>
                    </div>
                    {/* Placeholder for the AI-generated Hero Image */}
                    <div className="hero-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1600&auto=format&fit=crop')" }}></div>
                </div>
            </section>

            <section className="bento-section" id="features">
                <div className="bento-grid">
                    <div className="bento-left">
                        <div className="bento-card">
                            <div className="bento-label">HIRELENS AI</div>
                            <h2>Built for every team that needs to hire top talent—without the headache</h2>
                            <p>Whether you're a startup looking for your first engineers, or a scaling enterprise evaluating thousands of applicants, HireLens gives you instant clarity powered by advanced AI and live proctored tests.</p>
                        </div>
                        <div className="bento-stats">
                            <div className="stat-card">
                                <div className="stat-label">Time Saved Per Hire</div>
                                <div className="stat-number">95%</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Candidates Analyzed</div>
                                <div className="stat-number">2M+</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">AI Accuracy Rate</div>
                                <div className="stat-number">99.2%</div>
                                <div className="stat-desc">Validated by HR Experts</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Active Users</div>
                                <div className="stat-number">50k+</div>
                                <div className="stat-desc">Across 120+ Countries</div>
                            </div>
                        </div>
                    </div>
                    <div className="bento-feature">
                        <div>
                            <h2>From confusion to confidence in 60 seconds</h2>
                            <p>Upload any job description and let the AI create a custom screening pipeline: logic quizzes, technical coding challenges, and voice-to-voice behavioral interviews—all evaluated autonomously.</p>
                            <div className="bento-buttons">
                                <Link to="/register?role=HR" className="btn btn-secondary btn-nav"><span>Start Free Analysis</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="content-frame">
                <div className="content-inner">
                    <section className="insights-section" id="resources">
                        <div className="section-header">
                            <div className="section-eyebrow">Knowledge Center</div>
                            <h2>Learn, understand, hire better</h2>
                        </div>
                        <div className="insights-grid">
                            <div className="insight-card">
                                <div className="insight-content">
                                    <span className="insight-tag">Guide</span>
                                    <h3>5 Hidden Red Flags in Technical Resumes</h3>
                                    <p>Learn to spot keyword stuffing and exaggerated skills before you waste time on a screening call.</p>
                                </div>
                            </div>
                            <div className="insight-card">
                                <div className="insight-content">
                                    <span className="insight-tag">Case Study</span>
                                    <h3>How TechCorp Saved 1,200 Hours on Screening</h3>
                                    <p>A real story of how HireLens helped a scaling startup evaluate 10,000 developers completely autonomously.</p>
                                </div>
                            </div>
                            <div className="insight-card">
                                <div className="insight-content">
                                    <span className="insight-tag">Tutorial</span>
                                    <h3>Your First Autonomous Interview: A Walkthrough</h3>
                                    <p>From job creation to the final candidate ranking in under 2 minutes. See exactly how HireLens transforms hiring.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="services-section">
                        <div className="section-header">
                            <div className="section-eyebrow">Platform Features</div>
                            <h2>Everything you need to evaluate any candidate</h2>
                            <p>No bias. No endless scheduling. Just clear results.</p>
                        </div>
                        <div className="services-grid">
                            <div className="service-card">
                                <h3>Instant AI Analysis</h3>
                                <p>Our AI reads resumes and cross-references them with live test performance, giving you a comprehensive breakdown in seconds.</p>
                                <Link to="/register" className="service-link">Try It Now</Link>
                            </div>
                            <div className="service-card">
                                <h3>Smart Fit Scoring</h3>
                                <p>See a candidate's fit level at a glance. We aggregate technical skills, communication, and behavioral metrics into a single Trust Score.</p>
                                <a href="#features" className="service-link">Explore Features</a>
                            </div>
                            <div className="service-card">
                                <h3>Voice AI Interviews</h3>
                                <p>Our conversational AI agent conducts deep technical interviews over voice, adapting to the candidate's answers dynamically.</p>
                                <a href="#features" className="service-link">Explore Features</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <section className="testimonial">
                <div className="testimonial-inner">
                    <p className="testimonial-quote">HireLens transformed how our team recruits. What took weeks of screening calls now takes minutes, and we only talk to the best candidates. It's truly revolutionary for our business.</p>
                    <div className="testimonial-author">Sarah Jenkins</div>
                    <div className="testimonial-role">Head of Talent, NextGen AI</div>
                </div>
            </section>

            <section className="cta-banner" id="pricing">
                <div className="cta-inner">
                    <div className="cta-content">
                        <div className="cta-label">START TODAY</div>
                        <h2>Don't hire without full confidence</h2>
                        <p>Join 50,000+ HR professionals who recruit with AI. Get your first agent free—no credit card required.</p>
                        <Link to="/register?role=HR" className="btn btn-primary btn-nav"><span>Deploy AI Recruiter</span></Link>
                    </div>
                    {/* Placeholder for the AI-generated CTA Image */}
                    <div className="cta-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop')" }}></div>
                </div>
            </section>

            <footer id="about">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">HireLens</div>
                        <p className="footer-description">Making hiring autonomous for everyone. AI-powered evaluation that turns thousands of applicants into clear, ranked top performers.</p>
                    </div>
                    <div className="footer-column">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><Link to="/login">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 HireLens. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
