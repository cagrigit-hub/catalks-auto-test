import Head from "next/head"

function Error() {
    return (
        <>
        <Head>
                <title>Catalks Automation</title>
                <meta name="description" content="automation for CP , created with next" />
                <link rel="icon" href="/download.ico" />
            </Head>
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-8xl animate-bounce text-red-700 font-weigt-600 mb-4">Uyarı!</h1>
            <h1 className="text-5xl text-red-300 font-weight-500 mb-3">Hatalı Key</h1>
            <div className="flex justify-center items-center">
                <p>Kullandığınız key&apos;in süresi dolmuş olabilir, sizinle ilgilenen dernek gönüllüsüne geri dönüş yapınız..</p>
                <div style={{"width" :"1px"}} className="mx-2 h-8 bg-gray-300 "></div>
                <a href="mailto:careertalks@cpaths.org" className="hover:scale-150 ease-in duration-300 hover:mx-8 hover:shadow-gray hover:text-black">Kariyer Sohbetleri</a>
            </div>  
                
            </div>
            </>
    )
}

export default Error;
