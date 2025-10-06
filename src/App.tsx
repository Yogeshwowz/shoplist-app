import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-gray-50">
      <AppRoutes />
    </div>
  </BrowserRouter>
);
 
export default App;