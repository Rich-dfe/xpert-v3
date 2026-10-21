"use client"
import dynamic from "next/dynamic";

const LoggerMapLoader = dynamic(
  () => import("./LoggerMap"),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 400 }}>
        Loading map...
      </div>
    ),
  }
);

export default LoggerMapLoader;