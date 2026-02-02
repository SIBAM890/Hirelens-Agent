import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Code, ArrowRight } from 'lucide-react';

const JobBoard = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user (for candidate_id)
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const { data } = await candidateAPI.getJobs();
            setJobs(data);
        } catch (err) {
            console.error("Failed to load jobs", err);
        }
    };

    const handleApply = async (jobId) => {
        if (!user) {
            alert("Please login first!");
            return;
        }
        try {
            // 1. Tell Backend we are starting
            // Need to pass candidate_id. If backend uses Auth Middleware, it extracts from token.
            // But our endpoint expects candidate_id as query param? Let's check api.js

            // Assuming api.startApplication(jobId, candidateId)
            const { data } = await candidateAPI.startApplication(jobId, user.user_id);

            alert(`Application Started! ID: ${data.application_id}. Redirecting to Gate 1...`);

            // 2. Redirect to Gate 1 with Application ID
            navigate('/candidate/gate-1', { state: { applicationId: data.application_id } });
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to start application";
            alert(`Error: ${errorMessage}`);
            if (err.response?.status === 401 || err.response?.status === 404) {
                // Token invalid or User not found (due to DB reset)
                window.location.href = '/login';
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Open Positions</h1>
                <p className="text-gray-400 mb-12">Prove your skills to our AI Agents and get hired instantly.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.length === 0 && <p className="text-gray-500">No active job openings found.</p>}

                    {jobs.map(job => (
                        <div key={job.id} className="bg-neon-surface border border-white/10 p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(0,243,255,0.1)] transition-all relative overflow-hidden group">

                            {/* Decorative Gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-neon-blue/20" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <Briefcase className="text-neon-blue" />
                                    </div>
                                    <span className="text-xs font-mono bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                                        Exp: Open
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {job.skills?.map(skill => (
                                        <span key={skill} className="text-xs border border-gray-700 px-2 py-1 rounded text-gray-400">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleApply(job.id)}
                                    className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-neon-blue hover:shadow-[0_0_15px_#00f3ff] transition-all"
                                >
                                    <Code size={18} /> Take Challenge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobBoard;