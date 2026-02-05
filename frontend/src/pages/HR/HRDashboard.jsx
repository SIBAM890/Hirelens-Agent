import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hrAPI } from '../../services/api';
import { Plus, Users, Briefcase, FileText, ChevronRight } from 'lucide-react';

const HRDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // In a real app, we'd have a specific dashboard endpoint
                // For now, we'll fetch jobs to show something
                const res = await hrAPI.getDashboard(); // Or fallback
                // Just mocking for now if API fails as we built simplistic backend
                // let's assume getDashboard returns { jobs: [], candidates: ... }
                // Or we use existing endpoints
                setJobs(resume_data_mock);
                setLoading(false);
            } catch (err) {
                // Fallback Mock Data
                setJobs([
                    { id: 1, title: 'Senior React Developer', candidates: 12, status: 'Active' },
                    { id: 2, title: 'Python Backend Engineer', candidates: 8, status: 'Active' },
                    { id: 3, title: 'UI/UX Designer', candidates: 45, status: 'Closed' },
                ]);
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const resume_data_mock = [
        { id: 1, title: 'Senior React Developer', candidates: 12, status: 'Active' },
        { id: 2, title: 'Python Backend Engineer', candidates: 8, status: 'Active' },
        { id: 3, title: 'UI/UX Designer', candidates: 45, status: 'Closed' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-24 font-inter">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your job postings and candidates</p>
                    </div>
                    <Link
                        to="/hr/create-job"
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-primary/20 transition-all"
                    >
                        <Plus size={20} /> Post New Job
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Candidates', value: '1,284', icon: Users, color: 'blue' },
                        { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'green' },
                        { label: 'Pending Reviews', value: '45', icon: FileText, color: 'orange' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Active Jobs List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Recent Job Postings</h2>
                        <button className="text-primary font-medium text-sm hover:underline">View All</button>
                    </div>
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Job Title</th>
                                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Candidates</th>
                                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="text-right py-4 px-6 font-semibold text-slate-600 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-slate-900">{job.title}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex -space-x-2">
                                            {[...Array(Math.min(3, job.candidates))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {['JS', 'JD', 'AM'][i]}
                                                </div>
                                            ))}
                                            {job.candidates > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                                                    +{job.candidates - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link to={`/hr/job/${job.id}`} className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-1">
                                            Manage <ChevronRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
