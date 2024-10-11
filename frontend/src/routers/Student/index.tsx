import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Student/Home';
import SignOut from '../../pages/SignOut';

const RouterStudent: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/sign-out" element={<SignOut />} />
  </Routes>
);

export default RouterStudent;
