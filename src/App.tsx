import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CyberBackground } from './components/CyberBackground';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { CommunityPage } from './pages/CommunityPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ComicsPage } from './pages/ComicsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { PortalPage } from './pages/PortalPage';
import './App.css';

const MainContent: React.FC = () => {
  const { path } = useRouter();

  const renderCurrentPage = () => {
    switch (path) {
      case '/':
        return <HomePage />;
      case '/services':
        return <ServicesPage />;
      case '/community':
        return <CommunityPage />;
      case '/resources':
        return <ResourcesPage />;
      case '/comics':
        return <ComicsPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/login':
        return <LoginPage />;
      case '/portal':
        return <PortalPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-shell">
      <CyberBackground />
      <Navbar />
      <main id="main-content" className="app-main" tabIndex={-1}>
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <RouterProvider>
          <MainContent />
        </RouterProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
