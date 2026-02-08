import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// HR Pages
import HRDashboard from './pages/HR/HRDashboard';
import CreateJob from './pages/HR/CreateJob';
import JobReport from './pages/HR/JobReport';

// Candidate Pages
import JobBoard from './pages/Candidate/JobBoard';
import Gate1_Quiz from './pages/Candidate/Gate1_Quiz';
import Gate2_Coding from './pages/Candidate/Gate2_Coding';
import Gate3_TechInterview from './pages/Candidate/Gate3_TechInterview';
import Gate4_HRInterview from './pages/Candidate/Gate4_HRInterview';
import Gate5_Result from './pages/Candidate/Gate5_Result';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

const AppContent = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <>
            {!isLanding && <Navbar />}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* HR Routes - Protected */}
                <Route element={<ProtectedRoute role="HR" />}>
                    <Route path="/hr/dashboard" element={<HRDashboard />} />
                    <Route path="/hr/create-job" element={<CreateJob />} />
                    <Route path="/hr/job/:id" element={<JobReport />} />
                </Route>

                {/* Candidate Routes - Protected */}
                <Route element={<ProtectedRoute role="CANDIDATE" />}>
                    <Route path="/candidate/jobs" element={<JobBoard />} />
                    <Route path="/candidate/gate-1" element={<Gate1_Quiz />} />
                    <Route path="/candidate/gate-2" element={<Gate2_Coding />} />
                    <Route path="/candidate/gate-3" element={<Gate3_TechInterview />} />
                    <Route path="/candidate/gate-4" element={<Gate4_HRInterview />} />
                    <Route path="/candidate/gate-5" element={<Gate5_Result />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default App;
