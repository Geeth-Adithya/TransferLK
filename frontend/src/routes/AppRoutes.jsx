import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from '../View/Welcome/Welcome';
import Login from '../View/Auth/Login';
import Register from '../View/Auth/Register';
import ForgotPassword from '../View/Auth/ForgotPassword';

import Dashboard from '../View/Dashboard/Dashboard';
import PublicFindVacancy from '../View/Vacancy/PublicFindVacancy';
import FindVacancy from '../View/Vacancy/FindVacancy';
import VacancyDetails from '../View/Vacancy/VacancyDetails';
import PostVacancy from '../View/Vacancy/PostVacancy';
import Profile from '../View/Profile/Profile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSupport from '../components/ContactSupport';
import { isAuthenticated } from '../Controller/AuthController';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Navbar + animated content area + Footer
function PrivateLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 page-enter">{children}</div>
      <Footer />
    </div>
  );
}

// All routes live here so useLocation() works (inside BrowserRouter)
function AnimatedRoutes() {
  const location = useLocation();

  return (
    // key={location.pathname} forces re-mount → re-triggers .page-enter animation
    <Routes location={location} key={location.pathname}>

      {/* ── Public routes ── */}
      <Route path="/" element={
        <div className="page-enter"><Welcome /></div>
      } />
      <Route path="/login" element={
        <div className="page-enter"><Login /></div>
      } />
      <Route path="/register" element={
        <div className="page-enter"><Register /></div>
      } />
      <Route path="/forgot-password" element={
        <div className="page-enter"><ForgotPassword /></div>
      } />

      {/* Public vacancy search */}
      <Route path="/vacancies" element={
        <div className="flex flex-col min-h-screen page-enter">
          <Navbar />
          <PublicFindVacancy />
          <Footer />
        </div>
      } />

      {/* ── Private routes ── */}
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
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ContactSupport />
    </BrowserRouter>
  );
}

export default AppRoutes;
