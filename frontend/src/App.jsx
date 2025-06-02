import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navigation from './components/Navigation/Navigation';
import HomePage from './pages/HomePage/HomePage';
import HoldingsPage from './pages/HoldingsPage/HoldingsPage';
import ComparePage from './pages/ComparePage/ComparePage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/holdings" element={<HoldingsPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;