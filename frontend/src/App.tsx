import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterStudent from './routers/Student';
import context from './global/context';
import RouterHome from './routers/Home';
import Nav from './components/Nav';
import Footer from './components/Footer';
import reducer from './global/reduce';
import initialState from './global/state';
import { isStudent, send } from './tools/functions';
import { HTTP_STATUS_CODES } from './tools/const';
import ACTION from './global/action';

const App: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setUser();
  }, []);

  const setUser = async () => {
    const { response } = await send({ api: 'auth' }).post();

    if (response.statusCode === HTTP_STATUS_CODES.OK) {
      dispatch({ type: ACTION.SET_USER, payload: response.data });
    }
  }

  return (
    <context.Provider value={[state, dispatch]}>
      <Router>
        <Nav />
        {state.user.role === null && <RouterHome />}
        {isStudent(state.user.role) && <RouterStudent />}
        <Footer />
      </Router>
    </context.Provider>
  );
}

export default App;
