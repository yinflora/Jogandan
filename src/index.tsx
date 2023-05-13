import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import { LoadingContextProvider } from './context/LoadingContext';
import Achievement from './pages/Achievement';
import Compose from './pages/Compose';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SparkJoy from './pages/SparkJoy';
import Upload from './pages/Upload';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <LoadingContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="sign-up" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="upload" element={<Upload />} />
          <Route path="inventory" element={<Inventory />}>
            <Route path=":id" element={<Inventory />} />
          </Route>
          <Route path="achievement" element={<Achievement />} />
          <Route path="compose" element={<Compose />} />
          <Route path="spark-joy" element={<SparkJoy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </LoadingContextProvider>
);
