// Shared types between server and client is on package: @melo/types

declare global 
  type Log = {
  data: string;
  level: "warn" | "danger" | "success";
}