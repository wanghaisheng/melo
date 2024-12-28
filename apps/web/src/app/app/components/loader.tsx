import Image from "next/image";

interface LoaderProps {
  title: string;
  subtitle: string;
  progress: number;
}

export default function Loader({
  title,
  subtitle,
  progress,
}: LoaderProps) {

  return <div className="h-screen w-screen z-60 backdrop-blur-sm flex flex-col gap-2 items-center justify-center bg-white text-gray-700">
    <Image src="/melo.svg" alt="Melo Logo" width={600} height={600}/>
    <h1 className="text-2xl font-bold">{title}</h1>
    <h2 className="text-lg">{subtitle}</h2>
    <div className="mt-7 w-96 h-1 bg-gray-400 rounded-lg overflow-hidden">
      <div 
        style={{
          width: `${progress}%`,
        }}
        className="h-full bg-black animate-pulse"
      ></div>
    </div>
    <h1 className="text-4xl text-gray-300 font-bold">{progress} %</h1>

  </div>;
}