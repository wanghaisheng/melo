import useLogs from "@/web/hooks/useLogs";

export default function ChatLogs() {
  const { logs } = useLogs();

  if (logs.length <= 0) return null;
  
  return <div className="absolute select-none bottom-2 left-2 min-w-48 px-2 py-1 rounded-md bg-black/30 z-20">
    {logs.slice(0,5).map((log, i) => (
      <span 
      key={log.data + log.level + i}
        className={`
          text-xs
          flex flex-col
          ${log.level === "warn" && "text-yellow-500"}
          ${log.level === "success" && "text-green-400"}
          ${log.level === "danger" && "text-red-700"}
        `}>
        {log.data}
      </span>
    ))}
  </div>
}