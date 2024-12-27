// Zustand store for toast component
import { create } from "zustand";

interface LogStore {
  logs: Log[];
  addLogs: (_:Log) => void;
  clearLogs: () => void;
}

const useLogStore = create<LogStore>(set => ({
  logs: [],
  addLogs: (log: Log) => set(prev => ({ logs: [...prev.logs, log]})),
  clearLogs: () => set(_ => ({ logs: [] })),
}));

export default useLogStore;