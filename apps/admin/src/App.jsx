import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './routes/AdminRoutes';
import Login from './pages/Login';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}
