import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import app from '../../lib/firebase';

import Error from "../../components/Error";
import FormPage from "../../components/FormPage";
import { getFirestore ,doc,getDoc} from 'firebase/firestore';
export async function getServerSideProps({query}) {
    const db = await getFirestore(app);
    const dbRef = await doc(db,"mainPassword","password");
    let pass = null;
    const {key} = query;
 
    const dbSnapShot = await (await getDoc(dbRef)).data().password;
    pass = dbSnapShot;
    var isOk = false;
    if(pass === key){
      isOk = true
    }
    return {
      props: {isOk}, // will be passed to the page component as props
    }
  }

export default function Page({isOk}) {
  
  if (isOk){
    return (
        <FormPage />
        
      )
  }
  else {
      return <Error />
  }
  
}
