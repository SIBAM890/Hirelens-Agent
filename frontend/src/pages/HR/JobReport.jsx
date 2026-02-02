import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hrAPI } from '../../services/api';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

const JobReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await hrAPI.getJobReport(id);
                setReport(data);
            } catch (err) {
                alert("Failed to load report");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const getStatusIcon = (verdict) => {
        if (verdict === 'Hire') return <CheckCircle className="text-green-500" />;
        if (verdict === 'Reject') return <XCircle className="text-red-500" />;
        return <Clock className="text-yellow-500" />;
    };

    return (
        <div className="min-h-screen bg-neon-dark text-white p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate('/hr/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold mb-8">Candidate Analysis Report</h1>

                <div className="bg-neon-surface rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-gray-700">
                                <th className="p-4 text-gray-400 font-bold">Candidate</th>
                                <th className="p-4 text-gray-400 font-bold">Current Stage</th>
                                <th className="p-4 text-gray-400 font-bold">Quiz Score</th>
                                <th className="p-4 text-gray-400 font-bold">Coding Score</th>
                                <th className="p-4 text-gray-400 font-bold">Trust Score</th>
                                <th className="p-4 text-gray-400 font-bold">Verdict</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No candidates have applied yet.
                                    </td>
                                </tr>
                            ) : (
                                report.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold">{row.email}</td>
                                        <td className="p-4">
                                            <span className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded text-xs font-mono">
                                                {row.stage}
                                            </span>
                                        </td>
                                        <td className="p-4">{row.quiz_score !== null ? row.quiz_score : '-'}</td>
                                        <td className="p-4">{row.coding_score !== null ? row.coding_score : '-'}</td>
                                        <td className="p-4 font-bold text-lg">{row.profile_score !== null ? row.profile_score : '-'}%</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(row.final_verdict)}
                                                <span>{row.final_verdict || 'Processing'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JobReport;
