import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Student/Home';
import SignOut from '../../pages/SignOut';
import Page404 from '../../components/Page404';

const RouterStudent: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/sign-out" element={<SignOut />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;
