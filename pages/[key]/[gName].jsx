import { doc, getDoc, getFirestore } from "firebase/firestore";

import React, { useRef, useState } from 'react'
import app from '../../lib/firebase';
import emailjs from '@emailjs/browser';
import Head from 'next/head';
import Error from '../../components/Error';


export async function getServerSideProps({query}) {


    const {key,gName} = query;
    const db = getFirestore(app);
    const docRef = doc(db,"passwords" , gName)
    const docSnap = await getDoc(docRef);
    let pass = "";
    let konukInfo = null;
    let isOk = false;
    
    if (docSnap) {
        pass = docSnap.data().password;
      } else {
        // doc.data() will be undefined in this case
        konukInfo = false;
      }
    if (pass === key){
        isOk = true;
        const docRef = doc(db, "konukInfo", gName);
        const docSnap = await getDoc(docRef);
        konukInfo = docSnap.data();
    }
    return {
      props: {isOk,konukInfo}, // will be passed to the page component as props
    }
  }

function UserPage({isOk,konukInfo}) {
    
    const form = useRef();
    const [selected,setSelected] = useState(false);
    const [selected2,setSelected2] = useState(false);
    const [showAlert,setAlert] = useState(false);
    const [showAlert2,setAlert2] = useState(false);
    if (isOk){
        if(konukInfo !== null){
            emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
                function handleSubmit(e){
                    
                    e.preventDefault();
                    window.scrollTo({top: 0})
                    setTimeout(() => {
                        
                        emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID3, form.current , process.env.NEXT_PUBLIC_USER_ID)
                        .then((result) => {
                            console.log(result.text);
                            setAlert(true);
                        }, (error) => {
                            console.log(error.text);
                            setAlert2(true);
                        });
                    }, 2500);
                }
        return (
            <>
            <Head>
                <title>Catalks Automation</title>
                <meta name="description" content="automation for CP , created with next" />
                <link rel="icon" href="/download.ico" />
            </Head>
            <div className='flex flex-col justify-center items-center text-center'>
            <div style={showAlert ? {} :{display:"none"}} className='Alert mt-16 bg-green-100 flex flex-col rounded-lg'>
                <div className='flex justify-between'>
                    <div className='px-5 py-10 text-base md:text-lg font-medium text-green-800'>Cevab??n??z G??nderildi - Te??ekk??r Ederiz!</div>
                    <div className='pr-4 text-base md:text-lg font-medium text-green-800 cursor-pointer' onClick={() => {setAlert(false)}}>x</div>
                </div>
                <hr className='w-[50%] border border-green-300 self-center' />
            
                    <div className='p-5 my-8 text-base md:text-lg font-medium text-green-900' >Kesi??en Yollar Derne??i - Kariyer Sohbetleri</div>
                </div>

                <div style={showAlert2 ? {} :{display:"none"}} className='Alert mt-16 bg-red-100 flex flex-col rounded-lg'>
    
                    <div className='flex justify-between'>
                        <div className='px-5 py-10 text-base md:text-lg font-medium text-red-800'>OOPS! Bir ??eyler yanl???? gitti! Tekrar Deneyin Hala Devam Ediyorsa careertalks@cpaths.org bildiriniz.</div>
                        <div className='pr-4 text-base md:text-lg font-medium text-red-800 cursor-pointer' onClick={() => {setAlert2(false)}}>x</div>
                    </div>
                    <hr className='w-[50%] border border-red-300 self-center' />
                
                        <div className='p-5 my-8 text-base md:text-lg font-medium text-red-900' >Kesi??en Yollar Derne??i - Kariyer Sohbetleri</div>

                </div>
                <div className="top mt-36 mb-20 text-center flex flex-col justify-center items-center space-y-8">
                    <img className=' w-60 h-120' src="../../cpathslogo.webp" alt="cpaths-logo" />
                    <h1 className='text-xl md:text-3xl font-bold '>Kariyer Sohbetleri - Poster - CV Onay Formu</h1>
                </div> 
                <div className="konukInfo flex flex-col items-center justify-center text-center space-y-4">
                    <div className="konuk text-2xl"><span><strong>Konuk:</strong></span> {konukInfo.name}</div>
                    <a rel="noreferrer" className=" animate-pulse cursor-pointer  hover:text-gray-500 font-bold sm:text-xs md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-4 text-blue-300" target="_blank" href={konukInfo.poster}>Sizin ????in Haz??rlad??????m??z Postere Gitmek ????in T??klay??n??z.</a>
                    
                    <div className="title text-2xl "><span><strong>Yay??n Ba??l??????:</strong></span> {konukInfo.baslik}</div>
                    <div className="flex flex-col justify-center items-center">
                            <p className="sm:text-xs md:text-lg lg:text-xl xl:text-2xl font-bold" > CV</p>
                            <p className="sm:text-xs md:text-lg lg:text-xl xl:text-2xl  w-[40vh] md:w-[75vh]"> {konukInfo.cv}</p>
                        </div>
                    <div className="doc text-2xl"> 
                    <p className="sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Bu dok??mana g??z atman??z?? rica ediyoruz. <a rel="noreferrer" target="_blank" className="animate-pulse text-blue-300 hover:text-blue-400" href={konukInfo.yayinOncesi}> | Dok??man |</a> Bu dok??man yay??n ??ncesi sorular?? ve ak?????? g??rmeniz i??in ??nemlidir.</p>
                    </div>
                    <div className="streamyard text-2xl">
                    <p className="sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Yay??na giri?? yapaca????n??z url  <a rel="noreferrer" target="_blank" className="animate-pulse text-blue-300 hover:text-blue-400" href={konukInfo.yayinUrl}> | Giri?? Linki | </a> Yay??na bu link ile giri?? yap??l??yor, l??tfen bu linki kaydetmeyi unutmay??n??z.</p>
                    </div>

                    <form ref={form} onSubmit={handleSubmit} className='flex flex-col items-center justify-center space-y-4'>
                    <h1 className='text-xl md:text-xl font-bold'>Sizin i??in haz??rlad??????m??z Posterde de??i??tirilmesini istedi??iniz yerler var m???</h1>
                    <textarea className='border-2 rounded w-[40vh] lg:w-[70vh] p-4 resize-none' style={selected ? {    } : {display: "none"}} multiline rows={4}   placeholder="De??i??tirilmesi gereken yerler:"  name="posterToChange" />
                    <input name='guestName' style={{display:"none"}} value={konukInfo.name} />
                    <fieldset className='flex space-x-28 ' name='onay-group' >
                        <div >
                            <input onClick={() => {
                                setSelected(true);
                            }}name="cv-form" className='mx-1' type="radio" id="Evet" value="Evet" />
                            <label  htmlFor="Evet" className='font-semibold text-xl  '> Evet</label>
                        </div>
                        <div >
                            <input onClick={() => {
                                setSelected(false);
                            }} name="cv-form" className='mx-1' type="radio" id="Hay??r" value="Hay??r" defaultChecked/>
                            <label  htmlFor="Hay??r" className='font-semibold text-xl '> Hay??r</label>
                        </div>
                    </fieldset>



                    <h1 className='text-xl md:text-xl font-bold'>Poster harici de??i??tirilmesini istedi??iniz yerler var m???</h1>
                    <textarea className='border-2 rounded w-[40vh] lg:w-[70vh] p-4 resize-none' style={selected2 ? {    } : {display: "none"}} multiline rows={4}   placeholder="De??i??tirilmesi gereken yerler:"  name="toChange" />

                    <fieldset className='flex space-x-28 ' name='onay-group2' >
                        <div >
                            <input onClick={() => {
                                setSelected2(true);
                            }}name="cv-form2" className='mx-1 ' type="radio" id="Evet2" value="Evet" />
                            <label  htmlFor="Evet2" className='font-semibold text-xl '> Evet</label>
                        </div>
                        <div >
                            <input onClick={() => {
                                setSelected2(false);
                            }} name="cv-form2" className='mx-1' type="radio" id="Hay??r2" value="Hay??r" defaultChecked/>
                            <label  htmlFor="Hay??r2" className='font-semibold text-xl '> Hay??r</label>
                        </div>
                    </fieldset>
                    <button className=" mt-4 px-4 py-2 border-2 font-bold bg-blue-400 text-white ring hover:bg-white hover:text-blue-400 rounded-full" type="submit" variant="outlined" > <span stlye={{"fontFamily" : "Roboto",}}>Submit</span></button>
                    
                    </form>
                </div>
                <div className='h-[20vh]'></div>
            </div>
            </>
          )
        } else {
            return (
                <>
            <Head>
                <title>Catalks Automation</title>
                <meta name="description" content="automation for CP , created with next" />
                <link rel="icon" href="/download.ico" />
            </Head>
                <div className="flex h-screen justify-center items-center text-3xl text-red-500">Konuk bilgilerine ula????lamad??...</div>
            </>
            )
        }
    }
    
    else{
        return (
            <Error />
        )
    }
}
  

export default UserPage;