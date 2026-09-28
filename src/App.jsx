import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Docs from './pages/Docs';
import Login from './pages/Login';
import GetStarted from './pages/GetStarted';

function App() {
  return (
    <>
      <Toaster position="bottom-center" theme="system" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="docs" element={<Docs />} />
          <Route path="login" element={<Login />} />
          <Route path="get-started" element={<GetStarted />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
