import useLogStore from "@/web/store/log";

const useLogs = () => {
  const {
    logs,
    addLogs,
    clearLogs,
  } = useLogStore();

  const addNewLog = (log: Log) => {
    addLogs(log);
  }

  return {
    logs,
    addNewLog,
    clearLogs,
  }
}

export default useLogs;