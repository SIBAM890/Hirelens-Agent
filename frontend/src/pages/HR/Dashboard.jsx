import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hrAPI } from '../../services/api';
import { Plus, Users, BrainCircuit, Search, Bell, Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await hrAPI.getDashboard();
                setJobs(data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            }
        }
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Recruitment Dashboard</h1>
                        <p className="text-gray-500 mt-1">Overview of your automated hiring pipelines.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary transition-colors">
                            <Bell size={20} />
                        </button>
                        <Link
                            to="/hr/create-job"
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            <Plus size={18} /> Create New Agent
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Active Agents"
                        value={jobs.length}
                        icon={BrainCircuit}
                        trend="+2 this week"
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Total Candidates"
                        value={jobs.reduce((acc, job) => acc + job.candidates, 0)}
                        icon={Users}
                        trend="+12% vs last month"
                        color="bg-green-50 text-green-600"
                    />
                    <StatCard
                        label="Interviews Scheduled"
                        value="8"
                        icon={Search}
                        trend="For today"
                        color="bg-purple-50 text-purple-600"
                    />
                </div>

                {/* Job List Container */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-primary">Active Deployments</h2>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <Filter size={14} /> Filter
                            </button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Job Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Candidates</th>
                                    <th className="px-6 py-4">Performance</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map(job => (
                                    <tr key={job.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-primary">{job.title}</div>
                                            <div className="text-xs text-gray-500">ID: #{job.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white" />)}
                                                <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-medium">
                                                    +{job.candidates}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent w-[70%]" />
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 block">70% Avg Score</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/hr/edit-job/${job.id}`)}
                                                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/hr/job-report/${job.id}`)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-accent bg-accent/10 rounded-lg hover:bg-accent hover:text-white transition-colors"
                                                >
                                                    View Report <ArrowUpRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> {trend}
            </span>
        </div>
        <div>
            <h3 className="text-3xl font-bold text-primary tracking-tight">{value}</h3>
            <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
        </div>
    </div>
);

export default Dashboard;