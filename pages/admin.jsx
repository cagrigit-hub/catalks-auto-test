
import app from '../lib/firebase';
import React, { useState, useEffect ,useContext, useRef } from 'react';
import {getAuth, signOut} from "firebase/auth";
import {getFirestore,doc, setDoc, getDocs, collection, deleteDoc} from "firebase/firestore";
import {camelCase} from "lodash";
import { getDownloadURL, getStorage, uploadBytes ,ref as sRef } from 'firebase/storage';
import { MyContext } from './_app';
import Head from 'next/head';
import Script from 'next/script';
import emailjs from '@emailjs/browser';

function Admin() {
    emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
    const {authed , userInfo} = useContext(MyContext);
    const form = useRef();
    const [password , setPassword] = useState("");
    const [googleFormUrl,setGForm] = useState("");
    const [guestName, setName] = useState("");
    const [guestTitle, setTitle] = useState("");
    const [guestCv, setCv] = useState("");
    const [guestDoc, setDocc] = useState("");
    const [streamUrl , setUrl] = useState("");
    const [imgFile,setFile] = useState(null);
    const [desc,setDescription] = useState("");
    const [congrats, setCongrats] = useState(false);
    const [submitCongrats , setSubmit] = useState(false);
    const [error , setError] = useState(false);
    const [guestMail, setMail] = useState("");
    const [posterUrl,setPoster] = useState("");
    useEffect(() => {
      async function updater(){
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "passwords"));
        querySnapshot.forEach((docc) => {
        // doc.data() is never undefined for query doc snapshots
        if (Date.now() - Number(docc.data().date) > (1000 * 60 * 60 * 24 * 7)){
            deleteDoc(doc(db,"passwords",docc.id))
        } 
        else{
            console.log("OUT OF PASSWORDS");
        }
        });
      }
      updater();
    } ,[])
    const uploadImg = function(event){
      
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
        
      }

    }

    function googleCalendarEdit(){
      var gapi = window.gapi;
      
      gapi.auth2.init({
        'apiKey': process.env.NEXT_PUBLIC_API_KEY,
        'clientId': process.env.NEXT_PUBLIC_ID,
        'scope': 'https://www.googleapis.com/auth/calendar.events',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    })

      gapi.client.load('calendar' , "v3" , () => console.log("loaded.."));
      gapi.auth2.getAuthInstance().signIn().then(() => {
        

        gapi.client.calendar.events.list({'calendarId' :"primary" ,"timeMin" : new Date().toISOString()}).then((res) => {
          for (let event of res.result.items) {
            if (event.summary === `Kariyer Sohbetleri ${guestName} Yayını!`){
              event.description = streamUrl + " Yayına bu link üzerinden katılabilirsiniz."
              gapi.client.calendar.events.update({'calendarId' :"primary" ,"eventId" : event.id, "resource" : event}).then(res => console.log(res))
              event.description = "Career Talks: "+  guestTitle;
              gapi.client.calendar.events.insert({'calendarId' :"c_u1nev7giop0qlfqcuip0enk1c4@group.calendar.google.com" , 'resource' : event}).then(res => console.log(res));
        
            }
          }
        });

        
        
        
      })
    }     
    

    function handleSignOut(){
        const auth = getAuth(app);
        signOut(auth).then(() => {
        // Sign-out successful.
        }).catch((error) => {
        // An error happened.
        });
    }
      function handleSubmit(e){
        e.preventDefault();
        setSubmit(true);
        let ccName = camelCase(guestName) 
        const db = getFirestore(app);
        
        generateDescription();
        const storage = getStorage(app);
        let img = imgFile;
        const storageRef = sRef(storage, ccName +"poster.png");
        uploadBytes(storageRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(storageRef).then((url) => {
          setPoster(url);
          setDoc(doc(db,"konukInfo",ccName),{
            baslik : guestTitle,
            cv : guestCv,
            name: guestName,
            yayinOncesi: guestDoc,
            poster: url,
            sorumlu : userInfo,
            streamLink : streamUrl,
            konukMail : guestMail
          })
          
        });
        })
              
        googleCalendarEdit();    
        setTimeout(() => {

          emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID2, form.current , process.env.NEXT_PUBLIC_USER_ID)
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
        }, 2500);
            
       
      }



      function generatePassword(){
        const db = getFirestore(app);
       
        if(guestName === ""){
          setError(true);
          setCongrats(false);
        }
        else{
          setCongrats(true);
          setError(false);
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 12;
        var password = "";
        let ccName = camelCase(guestName) 
        
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber +1);
        }
        setPassword(password);
        
        setDoc(doc(db,"passwords",ccName),{
          "password" : password,
          "sahibi" : guestName,
          "date" : Date.now(),
          "sorumlu" : userInfo,
        })
        
        }
      }

      function generateDescription(){
        var description = `
        
        Sorularını Sor: ${googleFormUrl} **

        Kariyer Sohbetleri  **

        Diğer kariyer sohbetleri için http://bit.ly/cpathscareertalks / https://bit.ly/careertalksnewseason **
        Diğer kariyer sohbetlerinden kesitler için http://bit.ly/cpathscareertalksscenes **
        Kariyer sohbetlerini takip etmek için http://bit.ly/cpathscareertalkscalender ** 
        Spotify’dan bizi takip etmek için: https://bit.ly/kesisenyollarspotify **
        Kariyer Sohbetleri geri bildirimleriniz için:https://bit.ly/cpathsfeedback **
        - ** 
        Sayın ${guestName} ve ${guestName}nin özgeçmişi **
        ${guestCv} **
        - **
        Hakkımızda  **
        Kesişen Yollar Derneği, eğitim ve sosyal hizmet alanlarında Türkiye’ye yönelik çeşitli projeler geliştirmekte ve etkinlikler düzenlemektedir. Bu projeler ve etkinliklerdeki amacımız eğitimde fırsat eşitsizliğini azaltmak ve bunu yaparken de bambaşka dünyaları ve farklı hayat tarzlarını kesiştirmek, birbirimizden öğrenmek, esinlenmek ve birbirimize ilham kaynağı olmak. Her şeyin başı eğitim fakat biz bunun farklılıklara saygıyı, hoşgörüyü, empatiyi ve sosyal sorumluluk bilincini aşılayan bir eğitim olduğuna inanıyoruz. Bu inancı bizimle paylaşan ve bize destek olmak isteyen, etnik kökeni, inancı, siyasi görüşü, cinsiyeti, cinsel yönelimi ve yaşı ne olursa olsun herkesle ortak bir paydada buluşabileceğimize inanıyoruz. ** 

        Sosyal Medya ve İletişim **
        Facebook : http://bit.ly/cpathsfacebook **
        Instagram : http://bit.ly/cpathsinstagram **
        LinkedIn   : http://bit.ly/cpathslinkedin **
        Medium   : http://bit.ly/cpathsmedium **
        Twitter      : http://bit.ly/cpathstwitter **
        Website    : https://kesisenyollar.org/ **
        Mail          : info@cpaths.org  **

        Bize destek olmak için: https://bit.ly/cpaths-donation **

        `
        
        setDescription(description);
      }
      
  if (authed) {
      return (
        <>
          <Head>
          <title>Catalks Automation</title>
          <meta name="description" content="automation for CP , created with next" />
          <link rel="icon" href="/download.ico" />
        </Head>
        <Script  src="https://apis.google.com/js/client:plusone.js" />
          <div className='flex font-bold items-center h-[150vh] lg:h-[100vh] space-x-8 my-4 flex-col xs:space-y-96 sm:space-y-12 lg:space-y-0 overflow-hidden'>
            <div className='mr-4 flex flex-col lg:flex-row justify-center items-center space-y-12 lg:space-x-16 lg:space-y-0'>
            <h1 className='text-xl lg:text-3xl text-red-900 '> Authed / user: {userInfo}</h1> 
            <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded" onClick={handleSignOut} >Çıkış Yap</button>
            </div>
            <div className='flex flex-col lg:flex-row'>
              
              <div className='flex flex-col justify-center items-center h-screen space-y-2 flex-auto lg:w-[100vh]'>
              <div style={submitCongrats ? {} : {display : "none"}} className="bg-teal-100 mr-8  border-teal-500 rounded-b text-teal-900 px-4 py-3 " role="alert">
                      <div className="flex flex-col lg:flex-row">
    
                        <div>
                          <p className="font-bold">Konuk Bilgileri Başarıyla Güncellendi!</p>
                          <p className="text-sm">Bir sorun olursa Koordinatöre ulaş!</p>
                        </div>
                      </div>
                  </div>
                <form ref={form} className="flex mr-8 flex-col items-center justify-center space-y-1" onSubmit={handleSubmit}> 
                <h1 className="text-xl">Konuk Adını Giriniz</h1> 
                <input name="description" value={desc} style ={{display:"none"}} />
                <input name="poster" value={posterUrl} style ={{display:"none"}} />
                <input name="password" value={password} style ={{display:"none"}} />

                <input name="guestName" required value={guestName} onChange={(e) => {
                  setName(e.target.value);
                }} placeholder='Konuk Adı' className=' border-2 border-blue-500 w-80' />
                <h1 className="text-xl">Konuk Maili Giriniz</h1> 
              
              <input name="guestMail" required value={guestMail} onChange={(e) => {
                setMail(e.target.value);
              }} placeholder='Konuk Mail' className=' border-2 border-blue-500 w-80' />

                <h1 className="text-xl">Yayın Başlığını Giriniz</h1>
                <input name='title' required value={guestTitle} onChange={(e) => {
                  setTitle(e.target.value);
                }} placeholder='Yayın başlığı' className=' border-2 border-blue-500 w-80'  />

                <h1 className="text-xl">Posteri yükleyin</h1>
                <input required type="file" onChange={uploadImg} className='border-2 text-lg border-blue-500  w-80'  />
                <h1 className="text-xl">Hazırlanan özgeçmişi giriniz</h1>
                <textarea required name='cv'  value={guestCv} onChange={(e) => {
                  setCv(e.target.value);
                }} placeholder='Özgeçmiş' className='text-sm resize-none border-2 w-[320px] h-48 border-blue-500'  />
                <h1 className="text-xl">Yayın öncesi dokümanı linkini giriniz</h1>
                <input value={guestDoc} onChange={(e) => {
                  setDocc(e.target.value);
                }} type="url" name='doc' required placeholder='Yayın Öncesi Doc.' className=' border-2 border-blue-500 w-80'  />
                <h1 className="text-xl">Yayın giriş linkini giriniz</h1>
                <input value={streamUrl} onChange={(e) => {
                  setUrl(e.target.value);
                }} name="stream" type="url" required placeholder='Yayına giriş linki' className=' border-2 border-blue-500 w-80'  />
                <div className="flex flex-col text-center"> 
                  <h1 className="text-xl">Yayına Özel Hazırladığınız Google Form linkini giriniz.</h1>
                  <h3 className="text-base text-red-400"> Google Formunu Dernek Dışına Açmayı Unutmayınız! </h3>
                </div>
                <input name='form' value={googleFormUrl} onChange={(e) => {
                  setGForm(e.target.value);
                }} type="url" required placeholder='Google Form Linki' className=' border-2 border-blue-500 w-80'  />
                 

               

                <button type="submit"  className="bg-blue-700 text-lg hover:bg-blue-900 text-white font-bold py-2 px-4 rounded block mt-4" >Gönder</button>
                </form>
              </div>
              
              <div className='flex mr-8 lg:flex-auto  justify-center items-center flex-col space-y-2 lg:w-[100vh] '>
                      <div style={error ? {} : {display : "none"}} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Konuk Adı Giriniz! </strong>

                      <span className="absolute top-0 bottom-0 right-0">
                        <svg onClick={()  => {setError(false)}} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                      </span>
                    </div>  

                     <div style={congrats ? {} : {display : "none"}} className="bg-teal-100  border-teal-500 rounded-b text-teal-900 px-4 py-3 " role="alert">
                      <div className="flex flex-col lg:flex-row">
    
                        <div>
                          <p className="font-bold">Şifre oluşturuldu!</p>
                          <p className="text-sm">Şifreyi kaydettiğine emin ol!</p>
                        </div>
                      </div>
                  </div>

                <button  className="bg-blue-700 text-lg  hover:bg-blue-900 text-white font-bold py-2 px-4 rounded " onClick={generatePassword}>Generate Password</button>
                <textarea disabled className='text-lg border-2 border-blue-500 resize-none h-[40px]  w-[285px]' name="password" id="password" value={password}></textarea>
              </div>
            </div>

        </div>
        </>

      )
  }





  else {
      return (
      <div className='flex font-bold justify-center items-center  h-screen'>
          <h1 onClick={() => {
              window.location.href = "/login"
          }} className='text-3xl text-red-900 cursor-pointer underline '>NOT AUTHENTICATED -&gt; CLICK TO REDIRECT LOG IN PAGE</h1>
          </div>

      )
  }
}


export default Admin