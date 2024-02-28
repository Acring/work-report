'use client';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { cn } from '../lib/util';

export default function Index() {
  return (
    <div className="h-[100vh] relative">
      <div className="absolute bg-[url('/bg.png')] object-cover w-full bg-center bg-cover blur-xl hue-rotate-15 h-full z-[-1] grayscale-[50%]"></div>
      <header className="absolute top-0 w-full h-[48px] bg-[rgba(255,255,255,0.2)] backdrop-blur-md flex justify-between items-center px-4 z-10 shadow-sm">
        <div className="text-xl text-purple-400 font-bold">工时填报插件</div>
        <div></div>
      </header>
      <div className="absolute z-[1] pt-[128px] items-center flex flex-col w-full overflow-auto h-full pb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text">
          工时填报插件
          <span className="text-yellow-500 text-2xl">
            v{process.env.NEXT_PUBLIC_EXTENSION_VERSION}
          </span>
        </h1>
        <p className="text-center text-rose-300 mt-3">每月早下班一小时 👍</p>
        <a
          className=" flex-shrink-0 flex items-center group 
      group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 
      hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 
      before:duration-500 hover:duration-500  hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 
      hover:before:blur origin-left hover:decoration-2 hover:text-rose-300 relative 
      bg-[rgba(255,255,255,0.7)] h-[64px] w-64 border text-left p-3 text-violet-500 text-base font-bold  
      overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] 
      before:right-1 before:top-1 before:z-10 before:bg-violet-500 
      before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 
      after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full 
      after:blur-lg mt-6 text cursor-pointer rounded-full justify-center backdrop-blur-none"
          href={`/work-report-v${process.env.NEXT_PUBLIC_EXTENSION_VERSION}.zip`}
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
        {/* Usage */}
        <h2 className="pt-[128px] text-3xl font-bold">📖 使用方法</h2>
        <div className=" flex flex-col gap-4 pt-[32px]">
          <UsageItem
            title="前往“扩展程序”页面"
            list={[
              '在新标签页中输入 chrome://extensions',
              '或者点开 Chrome 菜单，点击「扩展程序」菜单按钮，选择「管理扩展程序」。',
            ]}
            img="/usage-0.png"
            dir="right"
          ></UsageItem>
          <UsageItem
            dir="left"
            title="安装插件"
            list={[
              '点击开发者模式旁边的切换开关以启用开发者模式。',
              '点击 Load unpacked（加载解压缩）按钮，然后选择扩展程序目录',
            ]}
            img="/usage-1.png"
          ></UsageItem>
          <UsageItem
            dir="right"
            title="填写"
            list={[
              '打开工时表单页面，出现侧边提醒，说明插件正常工作。',
              '填写类型等重复信息，点击快速提交工时按钮，开始批量填写工时。',
            ]}
            img="/usage-2.png"
          ></UsageItem>
        </div>
      </div>
    </div>
  );
}

function UsageItem({
  title,
  list,
  img,
  dir,
}: {
  title: string;
  list: string[];
  img: string;
  dir: 'left' | 'right';
}) {
  return (
    <div
      className={cn('flex justify-between items-center gap-20', {
        'flex-row': dir === 'left',
        'flex-row-reverse': dir === 'right',
      })}
    >
      <div className="">
        <div className="text-xl font-bold">{title}</div>
        <ul
          role="list"
          className="marker:text-sky-400 list-disc pl-2 space-y-2 text-gray-600 mt-4"
        >
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <Image
          width="512"
          height={480}
          src={img}
          alt={title}
          className="rounded-lg shadow-lg"
        ></Image>
      </div>
    </div>
  );
}
