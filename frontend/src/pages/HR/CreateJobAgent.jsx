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
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-neon-blue">1. Job Overview</h3>
            <div className="grid grid-cols-2 gap-4">
                <input placeholder="Job Title" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <input placeholder="Company Name" className="input-field" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} required />
                <input placeholder="Location (Remote/City)" className="input-field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                <select className="input-field" value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                </select>
                <input placeholder="Salary Range (e.g. 10-20 LPA)" className="input-field" value={formData.salary_range} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} />
                <input placeholder="Experience (e.g. 2-5 Years)" className="input-field" value={formData.experience_level} onChange={e => setFormData({ ...formData, experience_level: e.target.value })} />
                <div className="col-span-2">
                    <label className="text-xs text-gray-400">Application Deadline</label>
                    <input type="date" className="input-field" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
            </div>
        </div>
    );

    const renderStep2_Details = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-neon-blue">2. Detailed Description</h3>
            <textarea placeholder="Role Summary (Short)" rows="3" className="input-field" value={formData.role_summary} onChange={e => setFormData({ ...formData, role_summary: e.target.value })} required />
            <textarea placeholder="Key Responsibilities (Bulleted)" rows="5" className="input-field" value={formData.responsibilities} onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} />
            <input placeholder="Required Skills (Comma separated)" className="input-field" value={formData.required_skills} onChange={e => setFormData({ ...formData, required_skills: e.target.value })} required />
            <input placeholder="Tools & Tech Stack" className="input-field" value={formData.tools_tech} onChange={e => setFormData({ ...formData, tools_tech: e.target.value })} />
        </div>
    );

    const renderStep3_Company = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-neon-blue">3. Company & Culture</h3>
            <textarea placeholder="About Company" rows="3" className="input-field" value={formData.company_about} onChange={e => setFormData({ ...formData, company_about: e.target.value })} />
            <textarea placeholder="Mission / Vision" rows="2" className="input-field" value={formData.company_mission} onChange={e => setFormData({ ...formData, company_mission: e.target.value })} />
            <textarea placeholder="Perks & Benefits" rows="3" className="input-field" value={formData.perks_benefits} onChange={e => setFormData({ ...formData, perks_benefits: e.target.value })} />
        </div>
    );

    const renderStep4_Process = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-neon-blue">4. Process & Contact</h3>
            <textarea placeholder="Hiring Process Steps (e.g. 1. Quiz, 2. Code...)" rows="4" className="input-field" value={formData.hiring_process} onChange={e => setFormData({ ...formData, hiring_process: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
                <input placeholder="HR Email" type="email" className="input-field" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} required />
                <input placeholder="Phone / WhatsApp" className="input-field" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} />
                <input placeholder="Website URL" className="input-field col-span-2" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
            </div>

            <div className="mt-4">
                <label className="block text-gray-400 mb-2">Passing Score for AI Quiz (default 60%)</label>
                <input type="number" className="input-field w-24" value={formData.pass_marks} onChange={e => setFormData({ ...formData, pass_marks: e.target.value })} />
            </div>
        </div>
    );

    const renderStep5_Upload = () => (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-neon-blue">5. Train Your Agent</h3>
            <p className="text-gray-400">Upload a PDF containing your Question Bank, detailed policy, or technical documents. The AI will parse this to conduct interviews.</p>

            <div className={`border-2 border-dashed border-gray-600 rounded-xl p-10 transition-all ${formData.file ? 'bg-neon-blue/10 border-neon-blue' : 'hover:border-gray-400'}`}>
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
                            <CheckCircle size={48} className="text-green-400" />
                            <span className="text-lg font-bold text-white">{formData.file.name}</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={48} className="text-gray-500" />
                            <span className="text-lg font-bold text-gray-400">Click to Upload Knowledge Base (PDF)</span>
                        </>
                    )}
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neon-dark text-white p-8 pt-24 flex justify-center">
            <div className="w-full max-w-3xl bg-neon-surface border border-white/10 p-8 rounded-2xl shadow-2xl">

                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${step >= i ? 'bg-neon-blue text-black shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800 text-gray-500'}`}>
                            {i}
                        </div>
                    ))}
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-800 -z-0">
                        <div className="h-full bg-neon-blue transition-all duration-300" style={{ width: `${(step - 1) * 25}%` }} />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && renderStep1_Overview()}
                    {step === 2 && renderStep2_Details()}
                    {step === 3 && renderStep3_Company()}
                    {step === 4 && renderStep4_Process()}
                    {step === 5 && renderStep5_Upload()}

                    <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
                        {step > 1 ? (
                            <button type="button" onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                                <ArrowLeft size={20} /> Back
                            </button>
                        ) : <div></div>}

                        {step < 5 ? (
                            <button type="button" onClick={handleNext} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-neon-blue transition-all flex items-center gap-2">
                                Next <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                disabled={loading || !formData.file}
                                className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_#00f3ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deploying...' : 'Finalize & Deploy Agent'}
                            </button>
                        )}
                    </div>
                </form>

                {/* Inline CSS Helper */}
                <style>{`
                    .input-field {
                        width: 100%;
                        background: rgba(0,0,0,0.5);
                        border: 1px solid #374151;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        color: white;
                        outline: none;
                        transition: all 0.2s;
                    }
                    .input-field:focus {
                        border-color: #00f3ff;
                        box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default CreateJobAgent;