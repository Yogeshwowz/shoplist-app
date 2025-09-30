import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CategoryPage from './pages/CategoryPage';
import SummaryPage from './pages/SummaryPage';
import ConfirmPage from './pages/ConfirmPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<WelcomePage />} />
    <Route path="/category/:name" element={<CategoryPage />} />
    <Route path="/summary" element={<SummaryPage />} />
    <Route path="/confirm" element={<ConfirmPage />} />
  </Routes>
);

export default AppRoutes;