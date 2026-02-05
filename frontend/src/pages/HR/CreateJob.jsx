import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrAPI } from '../../services/api';
import { UploadCloud, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const CreateJobAgent = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Comprehensive State
    const [formData, setFormData] = useState({
        // 1. Overview
        title: '', company_name: '', location: '', job_type: 'Full-time',
        experience_level: '', salary_range: '', deadline: '',
        pass_marks: 60,

        // 2. Details
        role_summary: '', responsibilities: '', required_skills: '', tools_tech: '',

        // 3. Company
        company_about: '', company_mission: '', perks_benefits: '',

        // 4. Process & Contact
        hiring_process: '', contact_email: '', contact_phone: '', website: '',

        // 5. Knowledge Base
        file: null
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) return alert("Knowledge Base PDF is required!");

        setLoading(true);
        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'file') data.append(key, formData[key]);
        });
        // Append file named specific to backend expectation 'knowledge_base'
        data.append('knowledge_base', formData.file);
        // Note: backend 'description' field is required, we use 'role_summary' as description
        data.append('description', formData.role_summary);

        try {
            await hrAPI.createJob(data);
            alert("Agent Deployed Successfully!");
            navigate('/hr/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to deploy agent. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep1_Overview = () => (
        <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-accent flex items-center justify-center text-sm">01</span>
                Job Overview
            </h3>
            <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Job Title</label>
                    <input placeholder="e.g. Senior Frontend Engineer" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company Name</label>
                    <input placeholder="e.g. TechCorp" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} required />
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Location</label>
                    <input placeholder="e.g. Remote / New York" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Job Type</label>
                    <select className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })}>
                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Salary Range</label>
                    <input placeholder="e.g. $120k - $150k" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.salary_range} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} />
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Experience</label>
                    <input placeholder="e.g. 3-5 Years" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.experience_level} onChange={e => setFormData({ ...formData, experience_level: e.target.value })} />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Application Deadline</label>
                    <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
            </div>
        </div>
    );

    const renderStep2_Details = () => (
        <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-accent flex items-center justify-center text-sm">02</span>
                Role Details
            </h3>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role Summary</label>
                <textarea placeholder="Brief overview of the position..." rows="3" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.role_summary} onChange={e => setFormData({ ...formData, role_summary: e.target.value })} required />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Key Responsibilities</label>
                <textarea placeholder="- Design UI components..." rows="5" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.responsibilities} onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Required Skills (Comma separated)</label>
                <input placeholder="React, Node.js, Python" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.required_skills} onChange={e => setFormData({ ...formData, required_skills: e.target.value })} required />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tools & Tech Stack</label>
                <input placeholder="Jira, Figma, Docker" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.tools_tech} onChange={e => setFormData({ ...formData, tools_tech: e.target.value })} />
            </div>
        </div>
    );

    const renderStep3_Company = () => (
        <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-accent flex items-center justify-center text-sm">03</span>
                Company & Culture
            </h3>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">About Company</label>
                <textarea placeholder="Tell us about your organization..." rows="3" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.company_about} onChange={e => setFormData({ ...formData, company_about: e.target.value })} />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mission / Vision</label>
                <textarea placeholder="Your core values and goals..." rows="2" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.company_mission} onChange={e => setFormData({ ...formData, company_mission: e.target.value })} />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Perks & Benefits</label>
                <textarea placeholder="Remote work, Health insurance..." rows="3" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.perks_benefits} onChange={e => setFormData({ ...formData, perks_benefits: e.target.value })} />
            </div>
        </div>
    );

    const renderStep4_Process = () => (
        <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-accent flex items-center justify-center text-sm">04</span>
                Process & Contact
            </h3>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hiring Process Steps</label>
                <textarea placeholder="1. Initial Quiz, 2. AI Interview..." rows="4" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.hiring_process} onChange={e => setFormData({ ...formData, hiring_process: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">HR Email</label>
                    <input placeholder="hr@company.com" type="email" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} required />
                </div>
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone / WhatsApp</label>
                    <input placeholder="+1 234..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Website URL (Optional)</label>
                    <input placeholder="https://company.com/careers" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-800 mb-2 block">AI Passing Criteria</label>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-yellow-700">Minimum Score to Pass Quiz:</span>
                    <input type="number" className="w-24 bg-white border border-yellow-200 rounded-lg p-2 text-center font-bold text-gray-800" value={formData.pass_marks} onChange={e => setFormData({ ...formData, pass_marks: e.target.value })} />
                    <span className="text-sm font-bold text-gray-500">%</span>
                </div>
            </div>
        </div>
    );

    const renderStep5_Upload = () => (
        <div className="space-y-8 text-center animate-fade-in-up py-4">
            <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-primary mb-2">Train Your Agent</h3>
                <p className="text-gray-500 mb-8">Upload a PDF containing your Question Bank, technical documents, or company policies. The AI will study this to conduct interviews.</p>

                <div className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 group ${formData.file ? 'bg-green-50 border-green-400' : 'border-gray-300 hover:border-accent hover:bg-blue-50/50'}`}>
                    <input
                        type="file"
                        id="file-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        {formData.file ? (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce-short">
                                    <CheckCircle size={40} className="text-green-600" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-green-700 block mb-1">Upload Successful!</span>
                                    <span className="text-sm text-green-600 font-medium bg-green-100/50 px-3 py-1 rounded-full">{formData.file.name}</span>
                                </div>
                                <span className="text-xs text-green-500 mt-2 hover:underline">Click to change file</span>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={40} className="text-accent" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-primary block">Upload Knowledge Base</span>
                                    <span className="text-sm text-gray-400">PDF files only (Max 10MB)</span>
                                </div>
                                <span className="text-xs text-accent font-semibold mt-4 py-2 px-4 bg-white rounded-full shadow-sm border border-blue-100">Select File</span>
                            </>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24 font-sans">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/hr/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <h1 className="text-2xl font-bold text-primary relative z-10">Create New Job Agent</h1>
                        <p className="text-gray-500 relative z-10">Deploy a new autonomous hiring agent in 5 simple steps.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex justify-between relative max-w-xl mx-auto">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full overflow-hidden">
                                <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 4) * 100}%` }} />
                            </div>

                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ring-4 ring-white ${step >= i ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110' : 'bg-gray-200 text-gray-500'}`}>
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit}>
                            {step === 1 && renderStep1_Overview()}
                            {step === 2 && renderStep2_Details()}
                            {step === 3 && renderStep3_Company()}
                            {step === 4 && renderStep4_Process()}
                            {step === 5 && renderStep5_Upload()}

                            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                                {step > 1 ? (
                                    <button type="button" onClick={handleBack} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2">
                                        <ArrowLeft size={18} /> Previous
                                    </button>
                                ) : <div />}

                                {step < 5 ? (
                                    <button type="button" onClick={handleNext} className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        disabled={loading || !formData.file}
                                        className="bg-gradient-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? 'Deploying Agent...' : 'Finalize & Deploy'} {loading && <span className="animate-spin">⏳</span>}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobAgent;