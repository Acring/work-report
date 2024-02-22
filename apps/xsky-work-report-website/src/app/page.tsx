'use client';
import confetti from 'canvas-confetti';

export default function Index() {
  return (
    <div className="h-[100vh] relative">
      <div className="absolute bg-[url('/bg.png')] object-cover w-full bg-center bg-cover blur-xl hue-rotate-15 h-full z-[-1] grayscale-[50%]"></div>
      <header className="absolute top-0 w-full h-[48px] bg-[rgba(255,255,255,0.2)] backdrop-blur-md flex justify-between items-center px-4">
        <div className="text-xl text-purple-400 font-bold">工时填报插件</div>
        <div></div>
      </header>
      <div className="absolute z-[1] pt-[128px] items-center flex flex-col w-full overflow-auto h-full">
        <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text">
          工时填报插件
          <span className="text-yellow-500 text-2xl">
            v{process.env.NEXT_PUBLIC_EXTENSION_VERSION}
          </span>
        </h1>
        <p className="text-center text-rose-300 mt-3">每月早下班一小时 👍</p>
        <a
          className="flex items-center group 
      group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 
      hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 
      before:duration-500 hover:duration-500  hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 
      hover:before:blur origin-left hover:decoration-2 hover:text-rose-300 relative 
      bg-[rgba(255,255,255,0.7)] h-16 w-64 border text-left p-3 text-violet-500 text-base font-bold  
      overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] 
      before:right-1 before:top-1 before:z-10 before:bg-violet-500 
      before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 
      after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full 
      after:blur-lg mt-6 text cursor-pointer rounded-full justify-center backdrop-blur-none"
          href="/work-report-v1.0.2.zip"
          onClick={() => {
            fetch('/api/download', { method: 'GET' });
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }}
        >
          点击下载
        </a>

        <video
          src="/Arc.mp4"
          className="w-[60%] mt-8 rounded-lg shadow-lg"
          autoPlay
          muted
          loop
          playsInline
          controls
        ></video>
      </div>
    </div>
  );
}
