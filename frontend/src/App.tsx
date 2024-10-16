import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterStudent from './routers/Student';
import context from './global/context';
import RouterHome from './routers/Home';
import Nav from './components/Nav';
import Footer from './components/Footer';
import reducer from './global/reduce';
import initialState from './global/state';
import { isAdmin, isSignOut, isStudent, send } from './tools/functions';
import { HTTP_STATUS_CODES } from './tools/const';
import ACTION from './global/action';
import RouterAdmin from './routers/Admin';

const App: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user: { role } } = state;

  useEffect(() => {
    setUser();
  }, []);

  const setUser = async (): Promise<void> => {
    const { response } = await send({ api: 'auth' }).post();

    if (response.statusCode === HTTP_STATUS_CODES.OK) {
      dispatch({ type: ACTION.SET_USER, payload: response.data });
    }
  }

  return (
    <context.Provider value={[state, dispatch]}>
      <Router>
        <Nav />
        {isSignOut(role) && <RouterHome />}
        {isStudent(role) && <RouterStudent />}
        {isAdmin(role) && <RouterAdmin />}
        {isSignOut(role) && <Footer />}
      </Router>
    </context.Provider>
  );
}

export default App;
