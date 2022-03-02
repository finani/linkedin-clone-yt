import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { login, logout } from './features/userSlice';
import './App.css';
import { selectUser } from './features/userSlice';
import Login from './Login';
import Feed from './Feed';
import Header from './Header';
import Sidebar from './Sidebar';

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, userAuth => {
      if (userAuth) {
        // user is logged in
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL,
          })
        );
      } else {
        // user is logged out
        dispatch(logout());
      }
    })
  }, [])

  return (
    <div className="app">
      <Header />

      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
        <Sidebar />
        <Feed />
        { /* Widgets */}
        </div>
      )}

    </div>
  );
}

export default App;
