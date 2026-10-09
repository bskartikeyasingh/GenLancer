import React, { useState } from 'react';
import SplashScreen from './components/landing/SplashScreen';
import LandingPage from './components/landing/LandingPage';
import TemplateCreativeStudioLight from './components/auth/TemplateCreativeStudioLight';
import RegisterPage from './components/auth/RegisterPage';
import CreatorDashboard from './components/dashboard/CreatorDashboard';
import CompanyDashboard from './components/dashboard/CompanyDashboard';

export default function App() {
  // Application routing views: 'splash' | 'landing' | 'login' | 'register' | 'creator-dashboard' | 'company-dashboard'
  const [currentView, setCurrentView] = useState('splash');
  const [initialRole, setInitialRole] = useState('freelancer'); // 'freelancer' | 'company'

  const handleLoginSuccess = (role) => {
    if (role === 'company') {
      setCurrentView('company-dashboard');
    } else {
      setCurrentView('creator-dashboard');
    }
  };

  const handleRegisterSuccess = (role) => {
    if (role === 'company') {
      setCurrentView('company-dashboard');
    } else {
      setCurrentView('creator-dashboard');
    }
  };

  const handleGoToRegister = (role = 'freelancer') => {
    setInitialRole(role);
    setCurrentView('register');
  };

  const handleGoToLogin = (role = 'freelancer') => {
    setInitialRole(role);
    setCurrentView('login');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* 1. Splash Screen View */}
      {currentView === 'splash' && (
        <SplashScreen 
          onFinish={() => setCurrentView('landing')} 
        />
      )}

      {/* 2. Main Landing Page View */}
      {currentView === 'landing' && (
        <LandingPage 
          onNavigateToLogin={() => handleGoToLogin('freelancer')}
          onNavigateToRegister={handleGoToRegister}
          onNavigateToBrandRegister={() => handleGoToRegister('company')}
          onNavigateToCreatorRegister={() => handleGoToRegister('freelancer')}
        />
      )}

      {/* 3. Authentication: Login View */}
      {currentView === 'login' && (
        <TemplateCreativeStudioLight 
          initialRole={initialRole}
          onNavigateToRegister={() => handleGoToRegister(initialRole)}
          onNavigateToLanding={() => setCurrentView('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 4. Authentication: Register View */}
      {currentView === 'register' && (
        <RegisterPage 
          initialRole={initialRole}
          onNavigateToLogin={() => handleGoToLogin(initialRole)}
          onNavigateToLanding={() => setCurrentView('landing')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* 5. Creator Hub & AI Portfolio Dashboard */}
      {currentView === 'creator-dashboard' && (
        <CreatorDashboard 
          onLogout={() => setCurrentView('login')}
          onSwitchToCompany={() => setCurrentView('company-dashboard')}
        />
      )}

      {/* 6. Company & Brand Enterprise Dashboard */}
      {currentView === 'company-dashboard' && (
        <CompanyDashboard 
          onLogout={() => setCurrentView('login')}
          onSwitchToCreator={() => setCurrentView('creator-dashboard')}
        />
      )}
    </div>
  );
}
