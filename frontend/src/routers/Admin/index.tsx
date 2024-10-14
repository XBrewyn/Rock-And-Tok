import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page404 from '../../components/Page404';
import Admin from '../../pages/Admin';
import SignOut from '../../pages/SignOut';

const RouterAdmin: React.FC = () => (
  <Routes>
    <Route index element={<Admin />} />
    <Route path="/sign-out" element={<SignOut />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterAdmin;
