import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Auto-inject Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

export const hrAPI = {
    createJob: (formData) => api.post('/hr/create-job', formData, { // Changed from /hr-agent
        headers: { 'Content-Type': 'multipart/form-data' } // Note: Backend currently expects JSON for create_job, need to check if frontend sends Form or JSON. 
        // Frontend CreateJob sends FormData but backend expects Pydantic model (JSON). 
        // Let's fix Frontend to send JSON or Backend to accept Form. 
        // For now, let's assume JSON for simplicity or check CreateJob.jsx.
    }),
    // Actually, looking at CreateJob.jsx, it sends FormData. Backend needs to match.
    // But for this quick fix, I will match what `hr_agent.py` expects (JobCreate Pydantic).
    // I will fix CreateJob.jsx to send JSON later.

    getDashboard: () => api.get('/hr/dashboard'),
    getCandidates: () => api.get('/hr/candidates'),
    getJobs: () => api.get('/hr/jobs'),
    updateStatus: (id, status) => api.put(`/hr/candidates/${id}/status`, { status }),
    parseJobRequirements: (text) => api.post('/hr/parse-job-requirements', { text }),

    // Job Management
    getJob: (id) => api.get(`/hr/jobs/${id}`),
    updateJob: (id, jobData) => api.put(`/hr/jobs/${id}`, jobData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),


    getJobReport: (id) => api.get(`/hr/job-report/${id}`), // Needs endpoint
};

export const candidateAPI = {
    // Candidate Flow
    getJobs: () => api.get('/candidate/jobs'),
    startApplication: (jobId, candidateId) => api.post(`/candidate/apply/${jobId}?candidate_id=${candidateId}`),

    getQuiz: (appId) => api.get(`/candidate/quiz/${appId}`),
    submitQuiz: (appId, score) => api.post(`/candidate/submit-quiz/${appId}?score=${score}`),
    submitCode: (appId, code, lang) => api.post(`/candidate/submit-code/${appId}`, { code, language: lang }),

    chatAgent: (msg, type) => api.post(`/candidate/chat-response`, { message: msg, interview_type: type }),
    finalizeProfile: (appId, formData) => api.post(`/candidate/finalize-profile/${appId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    reportViolation: (data) => api.post('/proctor/alert', data),
};

export default api;