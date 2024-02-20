'use client';
import confetti from 'canvas-confetti';
import { useCallback, useEffect } from 'react';

export default function Index() {
  const handleDownload = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="h-[100vh] relative">
      <div className="absolute bg-[url('/bg.png')] object-cover w-full bg-center bg-cover blur-xl hue-rotate-15 h-full z-[-1] grayscale-[50%]"></div>
      <header className="absolute top-0 w-full h-[48px] bg-[rgba(255,255,255,0.2)] backdrop-blur-md flex justify-between items-center px-4">
        <div className="text-xl text-purple-400 font-bold">工时填报插件</div>
        <div></div>
      </header>
      <div className="absolute z-[1] pt-[128px] items-center flex flex-col w-full overflow-auto h-full">
        <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text">
          工时填报插件 <span className="text-yellow-500 text-2xl">v1.0.2</span>
        </h1>
        <p className="text-center text-red-400 mt-4">每月早下班一小时</p>
        <a
          className="mt-8 bg-gradient-to-r from-purple-400 to-purple-300 text-white py-3 transition-all hover:shadow-lg rounded-full px-10"
          download="xsky-work-report-extension.zip"
          href="/work-report.zip"
          onClick={handleDownload}
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
