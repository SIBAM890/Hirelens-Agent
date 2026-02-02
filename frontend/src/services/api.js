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
    createJob: (formData) => api.post('/hr-agent/create-job', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getDashboard: () => api.get('/hr-agent/dashboard'),
    getJob: (id) => api.get(`/hr-agent/job/${id}`),
    editJob: (id, formData) => api.put(`/hr-agent/edit-job/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getJobReport: (id) => api.get(`/hr-agent/job-report/${id}`),
};

export const candidateAPI = {
    // Candidate Flow
    getJobs: () => api.get('/candidate/jobs'),
    startApplication: (jobId, candidateId) => api.post(`/candidate/apply/${jobId}?candidate_id=${candidateId}`),
    submitQuiz: (appId, score) => api.post(`/candidate/submit-quiz/${appId}?score=${score}`),
    submitCode: (appId, code, lang) => api.post(`/candidate/submit-code/${appId}`, { code, language: lang }),

    chatAgent: (msg, type) => api.post(`/candidate/chat-response`, { message: msg, interview_type: type }),
    finalizeProfile: (appId, formData) => api.post(`/candidate/finalize-profile/${appId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;