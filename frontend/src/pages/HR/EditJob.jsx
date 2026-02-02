import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hrAPI } from '../../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({ title: '', description: '', pass_marks: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await hrAPI.getJob(id);
                setJobData(data);
            } catch (err) {
                alert("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', jobData.title);
        formData.append('description', jobData.description);
        formData.append('pass_marks', jobData.pass_marks);

        try {
            await hrAPI.editJob(id, formData);
            alert("Job Updated Successfully!");
            navigate('/hr/dashboard');
        } catch (err) {
            alert("Failed to update job");
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Job Details...</div>;

    return (
        <div className="min-h-screen bg-neon-dark text-white p-8">
            <button onClick={() => navigate('/hr/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-8">
                Edit Agent Parameters
            </h1>

            <form onSubmit={handleSubmit} className="max-w-2xl bg-neon-surface p-8 rounded-xl border border-gray-800 shadow-2xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Job Title</label>
                        <input
                            type="text"
                            value={jobData.title}
                            className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg focus:border-neon-blue outline-none text-white"
                            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea
                            rows="5"
                            value={jobData.description}
                            className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg focus:border-neon-blue outline-none text-white"
                            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Passing Marks (%)</label>
                        <input
                            type="number"
                            value={jobData.pass_marks}
                            className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg focus:border-neon-blue outline-none text-white"
                            onChange={(e) => setJobData({ ...jobData, pass_marks: e.target.value })}
                        />
                    </div>

                    <button className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-neon-blue/80 transition-all">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJob;
