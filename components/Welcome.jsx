import Head from 'next/head'

export default function Welcome() {
  return (
    <div>
      <Head>
        <title>Catalks Automation</title>
        <meta name="description" content="automation for CP , created with next" />
        <link rel="icon" href="/download.ico" />
      </Head>

      <main className='h-screen text-center space-y-12 flex items-center justify-center flex-col'>

      <img className='w-40 lg:w-80' src="cpathslogo.webp" alt="cpaths-logo" />
      <h1 className='text-sm md:text-xl lg:text-2xl font-bold'>
        Hoşgeldiniz! Geçerli bir giriş linkine sahip misiniz? Değilseniz lütfen sizinle iletişimde olan Kariyer Sohbetleri görevlisine durumu bildiriniz.
      </h1>
       <button onClick={() => {
         window.location.href = window.location.href = "mailto:careertalks@cpaths.org";
       }}className='px-2 py-1 text-sm lg:px-6 lg:py-4 border font-semibold lg:text-lg hover:bg-blue-500 hover:text-white border-blue-500 rounded-full transition duration-300'>Kariyer Sohbetleri</button>
      </main> 

    </div>
  )
}
