import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AppLayout from './pages/AppLayout';
import VideoEmbedPage from './pages/VideoEmbedPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/video" element={<VideoEmbedPage />} />
        <Route path="/app/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;