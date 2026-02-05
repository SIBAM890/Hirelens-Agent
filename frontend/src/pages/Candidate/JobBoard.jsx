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
        <div className="min-h-screen bg-gray-50 p-8 pt-24 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-3">Open Positions</h1>
                    <p className="text-gray-500 text-lg">Prove your skills to our AI Agents and get hired instantly.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.length === 0 && (
                        <div className="col-span-2 text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No active job openings found.</p>
                            <p className="text-sm text-gray-400 mt-1">Please check back later or ask an HR Manager to post a job.</p>
                        </div>
                    )}

                    {jobs.map(job => (
                        <div key={job.id} className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl hover:shadow-accent/5 hover:border-accent/20 transition-all group relative overflow-hidden">

                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-blue-50 text-accent rounded-xl group-hover:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                </div>
                                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    Active
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{job.title}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {job.skills?.map(skill => (
                                    <span key={skill} className="text-xs font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => handleApply(job.id)}
                                className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-lg shadow-gray-200 hover:shadow-accent/20"
                            >
                                <Code size={18} /> Take AI Challenge <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobBoard;