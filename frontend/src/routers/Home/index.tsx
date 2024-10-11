import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page404 from '../../components/Page404';
import Home from '../../pages/Home';
import SignUp from '../../pages/SignUp';
import Login from '../../pages/Login';

const RouterHome: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterHome;
