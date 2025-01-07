import { cn } from "@melo/ui/lib/utils";
import Image from "next/image";

interface LoaderProps {
  title: string;
  subtitle: string;
  progress?: number;

  className?: string;
}

export default function Loader({
  title,
  subtitle,
  progress,
  className
}: LoaderProps) {
  return <div className={cn("h-screen w-screen z-60 backdrop-blur-md flex flex-col gap-2 items-center justify-center bg-white/40 text-gray-700", className)}>
    <Image src="/melo.svg" alt="Melo Logo" width={600} height={600}/>
    <h1 className="text-2xl font-bold">{title}</h1>
    <h2 className="text-lg">{subtitle}</h2>
    {
      progress && (
        <>
          <div className="mt-7 w-96 h-1 bg-gray-400 rounded-lg overflow-hidden">
            <div 
              style={{
                width: `${progress}%`,
              }}
              className="h-full bg-black animate-pulse"
            ></div>
          </div>
          <h1 className="text-4xl text-gray-300 font-bold">{progress} %</h1>
        </>
      )
    }
  </div>;
}