import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from '../View/Welcome/Welcome';
import Login from '../View/Auth/Login';
import Register from '../View/Auth/Register';

import Dashboard from '../View/Dashboard/Dashboard';
import PublicFindVacancy from '../View/Vacancy/PublicFindVacancy';
import FindVacancy from '../View/Vacancy/FindVacancy';
import VacancyDetails from '../View/Vacancy/VacancyDetails';
import PostVacancy from '../View/Vacancy/PostVacancy';
import Profile from '../View/Profile/Profile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isAuthenticated } from '../Controller/AuthController';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Layout with Navbar + Footer for private pages
function PrivateLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes ── */}
        <Route path="/"          element={<Welcome />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        {/* Public vacancy search — no login required */}
        <Route path="/vacancies" element={
          <div className="flex flex-col min-h-screen">
            <PublicFindVacancy />
            <Footer />
          </div>
        } />

        {/* ── Private routes — login required ── */}
        <Route path="/vacancies/:id" element={
          <PrivateRoute>
            <PrivateLayout><VacancyDetails /></PrivateLayout>
          </PrivateRoute>
        } />

        <Route path="/post-vacancy" element={
          <PrivateRoute>
            <PrivateLayout><PostVacancy /></PrivateLayout>
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <PrivateLayout><Dashboard /></PrivateLayout>
          </PrivateRoute>
        } />

        <Route path="/find-vacancies" element={
          <PrivateRoute>
            <PrivateLayout><FindVacancy /></PrivateLayout>
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <PrivateLayout><Profile /></PrivateLayout>
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
