import React, { useState } from 'react'
import app from '../lib/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Head from 'next/head';


function Login() {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error,setError] = useState(false);

  function auth(email,password){
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = "/admin";
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        setError(true)
        setEmail("");
        setPassword("");
    });
}

  return (
      
    <div className='h-screen flex flex-col justify-center items-center'>
        <Head>
        <link rel="shortcut icon" href="download.ico" type="image/x-icon" />
        </Head>

        <div style={!error ? {"display" : "none"} : {}} className="text-3xl text-red-900">AUTHENTICATION FAILED!</div>
        <div>
            
            <div>Email</div>
            <input id="email" style={{"border" : "1px solid blue" , "marginBottom" : "15px"}}type="text" value={email} onChange={(e) => {
            setEmail(e.target.value);
        }}/>
        </div>
        <div>
            <div>Password</div>

            <input id = "password" style={{"border" : "1px solid blue" , "marginBottom" : "15px"}}type="password" value={password} onKeyDown={(e) => {
            if(e.key === "Enter"){
                auth(email,password)

            }
        }} onChange={(e) => {
            setPassword(e.target.value);
        }}/>
        </div>
        <button type="submit" className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"  onClick={() => {
            auth(email,password);
            
        }}>Giriş Yap</button>
            
    </div>
  )
}

export default Login