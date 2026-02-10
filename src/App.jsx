import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BeachSection from './components/BeachSection';
import TransportSection from './components/TransportSection';
import DynamicServices from './components/DynamicServices'; 
import GastronomySection from './components/GastronomySection';
import AgendaSection from './components/AgendaSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Contact from './components/Contact'; // Componente vacío para el Router
import './index.css';

// Componente que agrupa toda la página principal
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
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;