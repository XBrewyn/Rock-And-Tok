import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page404 from '../../components/Page404';
import Home from '../../pages/Home';
import SignUp from '../../pages/SignUp';
import Login from '../../pages/Login';
import Quiz from '../../pages/Quiz';

const RouterStudent: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;
