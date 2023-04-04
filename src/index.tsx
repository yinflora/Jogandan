import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import Home from './pages/Home/Home';
import Achievement from './pages/Achievement/Achievement';
import Compose from './pages/Compose/Compose';
// import Profile from './pages/Profile/Profile';
import Signin from './pages/Signin/Signin';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        {/* <Route path="profile" element={<Profile />} /> */}
        <Route path="signin" element={<Signin />} />
        <Route path="achievement" element={<Achievement />} />
        <Route path="compose" element={<Compose />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
