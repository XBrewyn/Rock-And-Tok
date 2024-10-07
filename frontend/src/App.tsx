import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterAdmin from './routers/Admin';
import RouterStudent from './routers/Student';
import Nav from './components/Nav';
import Footer from './components/Footer';

const App: React.FC = (): JSX.Element => {
  return (
    <>
      <Router>
        <Nav />
        <RouterStudent />
        <Footer />
      </Router>
    </>
  );
}

export default App;
