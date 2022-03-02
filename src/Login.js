import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './features/userSlice';
import { getAuth, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import './Login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const dispatch = useDispatch();

  const loginToApp = (e) => {
    e.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(userAuth => {
      dispatch(
        login({
          email: userAuth.user.email,
          uid: userAuth.user.uid,
          displayName: userAuth.user.displayName,
          photoUrl: userAuth.user.photoURL,
        })
      );
    }).catch((error) => alert(error))
  };
  const register = () => {
    if (!name) {
      return alert("Please enter a full name!")
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userAuth) => {
      updateProfile(userAuth.user, {
        displayName: name,
        photoURL: profilePic,
      })
      .then(() => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: name,
            photoUrl: profilePic,
          })
        );
      });
    }).catch((error) => alert(error));
  };

  return (
    <div className='login'>
      <img
        src="https://www.paperlesslabacademy.com/wp-content/uploads/2017/02/linkedin-logo-transparent-768x209.png"
        alt=""
      />

      <form>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Full name (required if registering)'
          type='text'/>
        <input
          value={profilePic}
          onChange={e => setProfilePic(e.target.value)}
          placeholder='Profile pic URL (optional)'
          type='text' />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          type='email' />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          type='password' />
        <button type='submit' onClick={loginToApp}>Sign in</button>
      </form>

      <p>Not a member?{" "}
        <span className='login__register' onClick={register}>Register Now</span>
      </p>
    </div>
  )
}

export default Login
