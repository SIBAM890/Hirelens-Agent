import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/HR/Dashboard';
import JobBoard from './pages/Candidate/JobBoard';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreateJobAgent from './pages/HR/CreateJobAgent';
import EditJob from './pages/HR/EditJob';
import JobReport from './pages/HR/JobReport';
import Gate1_Quiz from './pages/Candidate/Gate1_Quiz';
import Gate2_Coding from './pages/Candidate/Gate2_Coding';
import Gate3_TechInterview from './pages/Candidate/Gate3_TechInterview';


function App() {
    return (
        <Router>
            <AuthProvider>
                {/* Navbar is placed here so it stays visible on all pages */}
                <Navbar />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* HR Routes */}
                    <Route path="/hr/dashboard" element={
                        <ProtectedRoute role="HR">
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/hr/create-job" element={
                        <ProtectedRoute role="HR">
                            <CreateJobAgent />
                        </ProtectedRoute>
                    } />

                    <Route path="/hr/edit-job/:id" element={
                        <ProtectedRoute role="HR">
                            <EditJob />
                        </ProtectedRoute>
                    } />

                    <Route path="/hr/job-report/:id" element={
                        <ProtectedRoute role="HR">
                            <JobReport />
                        </ProtectedRoute>
                    } />

                    {/* Candidate Routes */}
                    <Route path="/candidate/jobs" element={
                        <ProtectedRoute role="CANDIDATE">
                            <JobBoard />
                        </ProtectedRoute>
                    } />

                    <Route path="/candidate/gate-1" element={
                        <ProtectedRoute role="CANDIDATE">
                            <Gate1_Quiz />
                        </ProtectedRoute>
                    } />

                    <Route path="/candidate/gate-2" element={
                        <ProtectedRoute role="CANDIDATE">
                            <Gate2_Coding />
                        </ProtectedRoute>
                    } />

                    <Route path="/candidate/gate-3" element={
                        <ProtectedRoute role="CANDIDATE">
                            <Gate3_TechInterview />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;