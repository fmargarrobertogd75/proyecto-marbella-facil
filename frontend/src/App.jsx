import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Secciones de la Home
import Hero from './components/Hero';
import BeachSection from './components/BeachSection';
import TransportSection from './components/TransportSection';
import DynamicServices from './components/DynamicServices';
import GastronomySection from './components/GastronomySection';
import AgendaSection from './components/AgendaSection';
import CTASection from './components/CTASection';

// Páginas (Importadas de la carpeta /pages según tu estructura)
import PlayasPage from './pages/PlayasPage';
import GastronomiaPage from './pages/GastronomiaPage';
import TransportePage from './pages/TransportePage';
import AgendaPage from './pages/AgendaPage';
import EmpresasPage from './pages/EmpresasPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PerfilUsuarioPage from './pages/PerfilUsuarioPage';
import NegocioDashboardPage from './pages/NegocioDashboardPage';
import RecompensasPage from './pages/RecompensasPage';
import Contact from './components/Contact';
import ChatIA from './components/ChatIA';

import './index.css';

// Componente de la Página Principal
const HomePage = () => (
  <>
    <Hero />
    <div className="bg-white"><BeachSection /></div>
    <div className="bg-dark-section"><TransportSection /></div>
    <div className="bg-gray"><DynamicServices /></div>
    <div className="bg-white"><GastronomySection /></div>
    <div className="bg-gray"><AgendaSection /></div>
    <CTASection />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Ruta Principal */}
            <Route path="/" element={<HomePage />} />

            {/* Rutas de las Páginas Internas */}
            <Route path="/playas" element={<PlayasPage />} />
            <Route path="/gastronomia" element={<GastronomiaPage />} />
            <Route path="/transporte" element={<TransportePage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/recompensas" element={<RecompensasPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/perfil" element={<PerfilUsuarioPage />} />
            <Route path="/negocio/dashboard" element={<NegocioDashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatIA />
      </div>
    </Router>
  );
}

export default App;