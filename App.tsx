import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { EnhancedChatProvider } from './context/EnhancedChatContext';
import CRMApp from './CRMApp';
import WorkApp from './WorkApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <EnhancedChatProvider>
            <Routes>
              <Route path="/crm/*" element={<CRMApp />} />
              <Route path="/work/*" element={<WorkApp />} />
              <Route path="/" element={<Navigate to="/crm" replace />} />
            </Routes>
          </EnhancedChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
