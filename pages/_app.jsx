import '../styles/globals.css'
import { createContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../lib/firebase';

const MyContext = createContext({authed : false,userInfo : ""});


function MyApp({ Component, pageProps }) {
    const [authed,setAuth] = useState(false)
    const [userInfo,setUser] = useState(null);
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setAuth(true);
        setUser(user.email);
        
        // ...
      } else {
        // User is signed out
        // ...
        setAuth(false);
      }
    })


  return (
    <MyContext.Provider value={{authed:authed,userInfo:userInfo }}>
      <Component {...pageProps} />

    </MyContext.Provider>
  )
}
export {MyContext};
export default MyApp
