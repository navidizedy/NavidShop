"use client";
import { memo } from "react";

const ArrowDownIcon = () => (
  <svg
    className="inline-block w-4 h-4 ml-1"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default memo(ArrowDownIcon);
