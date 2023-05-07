import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoadingContextProvider } from './context/loadingContext';
import { Timestamp } from 'firebase/firestore';

import App from './App';
import Home from './pages/Home/Home';
import Achievement from './pages/Achievement/Achievement';
import Compose from './pages/Compose/Compose';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Upload from './pages/Upload/Upload';
import Inventory from './pages/Inventory/Inventory';
import SparkJoy from './pages/SparkJoy/SparkJoy';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <LoadingContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="upload"
            element={
              <Upload
                setIsEdit={function (): void {
                  throw new Error('Function not implemented.');
                }}
                isEdit={false}
                selectedItem={null}
                setSelectedItem={function (
                  // eslint-disable-next-line no-unused-vars
                  value: React.SetStateAction<{
                    id?: string;
                    name: string;
                    status: string;
                    category: string;
                    created?: Timestamp;
                    processedDate?: string;
                    description: string;
                    images: string[];
                  } | null>
                ): void {
                  throw new Error('Function not implemented.');
                }}
              />
            }
          />
          <Route path="inventory" element={<Inventory />}>
            <Route path=":id" element={<Inventory />} />
          </Route>
          <Route path="achievement" element={<Achievement />} />
          <Route path="compose" element={<Compose />} />
          <Route path="sparkJoy" element={<SparkJoy />} />
          {/* <Route path="sparkJoy" element={<Advanced />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </LoadingContextProvider>
);
