import React from "react";

const Icon: React.FC = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="100"
      cy="100"
      r="90"
      stroke="#61DAFB"
      strokeWidth="10"
      strokeDasharray="20 10"
    />

    <g transform="translate(100 100)">
      <ellipse
        rx="45"
        ry="15"
        stroke="#61DAFB"
        strokeWidth="10"
        transform="rotate(0)"
      />
      <ellipse
        rx="45"
        ry="15"
        stroke="#61DAFB"
        strokeWidth="10"
        transform="rotate(60)"
      />
      <ellipse
        rx="45"
        ry="15"
        stroke="#61DAFB"
        strokeWidth="10"
        transform="rotate(120)"
      />

      <circle r="15" fill="#61DAFB" />
    </g>

    <circle
      cx="100"
      cy="100"
      r="30"
      stroke="#FF4154"
      strokeWidth="10"
      fill="none"
    />
    <circle cx="100" cy="100" r="10" fill="#FF4154" />
  </svg>
);

export default Icon;
