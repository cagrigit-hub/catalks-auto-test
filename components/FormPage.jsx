import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import Head from 'next/head';
import app from "../lib/firebase";
import { getStorage, ref , uploadBytes , getDownloadURL} from "firebase/storage";


function FormPage() {
  emailjs.init(process.env.NEXT_PUBLIC_USER_ID);


  const form = useRef()
  const [selected,setSelected] = useState(false);
  const [selected2,setSelected2] = useState(true);
  const [name,setName] = useState("");
  const [img, setImg] = useState("");
  const [showAlert,setAlert] = useState(false);
  const [showAlert2,setAlert2] = useState(false);
  const uploadImg = function(event){
    const storage = getStorage(app);
    
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      
      const storageRef = ref(storage, name +".png");

    uploadBytes(storageRef, img).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(ref(storage, name + ".png")).then((url) => {
        
        setImg(url);
    })
    }) }
    }


    const sendEmail = function(e) {
      e.preventDefault();
      setAlert(true);
      window.scrollTo({top: 0})
      setTimeout(() => {
        emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID, form.current , process.env.NEXT_PUBLIC_USER_ID)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
      }, 2500);
      
      
        
    };



    
  return (
    

    <>
    <Head>
        <title>Catalks Automation</title>
        <meta name="description" content="automation for CP , created with next" />
        <link rel="icon" href="/download.ico" />
      </Head>
      
    <div className='flex flex-col justify-center items-center'>


    <div style={showAlert ? {} :{display:"none"}} className='Alert mt-16 bg-green-100 flex flex-col rounded-lg'>
    <div className='flex justify-between'>
        <div className='px-5 py-10 text-base md:text-lg font-medium text-green-800'>Cevabınız Gönderildi - Takvimden Gün Ve Saat Seçtiğinizden Emin Olunuz!</div>
        <div className='pr-4 text-base md:text-lg font-medium text-green-800 cursor-pointer' onClick={() => {setAlert(false)}}>x</div>
      </div>
      <hr className='w-[50%] border border-green-300 self-center' />
   
        <div className='p-5 my-8 text-base md:text-lg font-medium text-green-900' >Kesişen Yollar Derneği - Kariyer Sohbetleri</div>
      
   
      
    </div>
    <div style={showAlert2 ? {} :{display:"none"}} className='Alert mt-16 bg-red-100 flex flex-col rounded-lg'>
    <div className='flex justify-between'>
        <div className='px-5 py-10 text-base md:text-lg font-medium text-red-800'>OOPS! Bir şeyler yanlış gitti! Tekrar Deneyin Hala Devam Ediyorsa careertalks@cpaths.org bildiriniz.</div>
        <div className='pr-4 text-base md:text-lg font-medium text-red-800 cursor-pointer' onClick={() => {setAlert2(false)}}>x</div>
      </div>
      <hr className='w-[50%] border border-red-300 self-center' />
   
        <div className='p-5 my-8 text-base md:text-lg font-medium text-red-900' >Kesişen Yollar Derneği - Kariyer Sohbetleri</div>
      
   
      
    </div>
      <div className="ust flex flex-col justify-center text-center items-center mt-20 space-y-8">
        <div className="img">
          <img className=' w-60 h-120' src="./cpathslogo.webp" alt="cpaths-logo" />
        </div>
        <div className="title text-3xl font-bold">
          CPATHS - Career Talks - CV FORM
        </div>
      </div>
      <div className="form flex flex-col items-center justify-center mt-16 text-center">
        <form onSubmit={(e) => {
          sendEmail(e);
        }} className='flex flex-col items-center justify-center space-y-4' ref={form}>
          {/** ISIM MAIL KISMI */}

          <h1 className='text-xl font-bold'>E-Mailiniz</h1>
          <input type="email" name="guestMail" id="email" required className='p-4 border-2  w-[40vh] lg:w-[70vh] rounded ' placeholder='E-Mail *' />
          
          <h1 className='text-xl font-bold'>Adınız / Soy Adınız</h1>
          <input type="text" name="guestName" id="name" required className='p-4 border-2 w-[40vh] lg:w-[70vh] rounded ' value={name} onChange={(e) => {
          setName(e.target.value);
        }} placeholder='Adınız Soyadınız *' />
          
          <h1 className='text-xl md:text-xl font-bold'>Sizin için yayın açıklamasında kullanmak üzere özgeçmiş oluşturmamızı ister misiniz?</h1>
          
          
          {/** ILK RADIO */}
          <fieldset className='flex space-x-28 ' name='cv-group' >
            <div className='flex justify-center items-center'>
              <input onClick={() => {
                  setSelected(false);
              }}name="cv-form" className='mx-1 h-4 w-4' type="radio" id="Evet" value="Evet" defaultChecked/>
              <label  htmlFor="Evet" className='font-semibold text-lg '> Evet</label>
            </div>
            <div>
              <input onClick={() => {
                  setSelected(true);
              }} name="cv-form" className='mx-1' type="radio" id="Hayır" value="Hayır" />
              <label  htmlFor="Hayır" className='font-semibold text-lg'> Hayır</label>
            </div>
          </fieldset>



          <h4 className="text-center font-bold text-lg" style={selected ? {} : {display: "none"}}>Sizi tanımamızı sağlayacak kısa bir paragraf yazabilir misiniz? (okulunuz tecrübeleriniz vs.) </h4>
          <textarea className='border-2 rounded w-[40vh] lg:w-[70vh] p-4 resize-none' style={selected ? {} : {display: "none"}} multiline rows={4}  id="outlined-basic" label="Sizi tanımamızı sağlayacak kısa bir paragraf" variant="outlined" name="guestCV" />
            
          
          {/** 2. RADIO */}

          <h1 className='text-xl md:text-xl font-bold'>Sizi yayın için hazırlanan sosyal medya gönderilerimizde etiketlememizi ister misiniz?</h1>

          <fieldset className='flex space-x-28 ' name='cv-group2' >
            <div>
              <input onClick={() => {
                  setSelected2(false);
              }}name="cv-form2" className='mx-1' type="radio" id="Evet2" value="Evet" />
              <label  htmlFor="Evet2" className='font-semibold text-lg '> Evet</label>
            </div>
            <div>
              <input onClick={() => {
                  setSelected2(true);
              }} name="cv-form2" className='mx-1' type="radio" id="Hayır2" value="Hayır" defaultChecked/>
              <label  htmlFor="Hayır2" className='font-semibold text-lg'> Hayır</label>
            </div>
            
          </fieldset>
          <h4 className="text-center font-bold text-lg" style={!selected2 ? {} : {display: "none"}}>Sosyal Medya Kullanıcı adlarınızı yazınız. </h4>
          <textarea className='border-2 rounded w-[40vh] lg:w-[70vh] p-4 resize-none' style={!selected2 ? {} : {display: "none"}} multiline rows={4}  id="outlined-basic" label="Sosyal Medya" placeholder="Instagram: örnek_örnek" variant="outlined" name="socialMedia" />
         


          {/** FOTO ISTEME KISMI */}
          <h1 className='text-xl font-bold'>Lütfen Posterde kullanmamızı istediğiniz bir fotoğrafınızı ekleyiniz</h1>
          <input type="file" accept='.png,.jpeg,.svg,.webp'  onChange={uploadImg} required className='p-4 border-2  w-[40vh] lg:w-[70vh] rounded '/>
          <input  focused={true} style={{"display" : "none"}} label="Fotoğrafınız"  variant="outlined" name="posterUrl" value={img}/>
          
        
          <button className=" mt-4 px-4 py-2 border-2 font-bold bg-blue-400 text-white ring hover:bg-white hover:text-blue-400 rounded-full" type="submit" variant="outlined" > <span stlye={{"fontFamily" : "Roboto",}}>Submit</span></button>
        
        </form>
      </div>
      <div className="takvim">
      <div  className="my-5"style={{display:"flex",alignItems:"center",textAlign: "center",justifyContent: "center"}}>
           <h1 id="s"  className="text-lg font-bold lg:text-2xl">Lütfen aşağıdan size uygun ve seçilmemiş <span className="text-red-400">(herhangi bir zaman aralığı gri olmayan)</span> bir gün (tercihen Pazar) - zaman seçiniz</h1>
        </div>
        <div className="flex flex-col lg:flex-row ">
        <iframe src="https://careertalks.youcanbook.me/?noframe=true&skipHeaderFooter=true" id="ycbmiframecareertalks"    style={{scrollBarWidth:"0px",marginBottom:"50px",width:"100%",height:"80vh",border:"0px",backgroundColor:"transparent",} }  allowtransparency="true"></iframe>
        </div>
      </div>
    </div>
    </>
  )
}

export default FormPage