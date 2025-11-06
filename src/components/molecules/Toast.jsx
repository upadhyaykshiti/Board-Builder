// // import React from "react";

// // export function Toast({ message, type = "info" }) {
// //   const color =
// //     type === "success" ? "bg-green-500" :
// //     type === "error" ? "bg-red-500" :
// //     "bg-gray-700";
// //   return (
// //     <div className={\`\${color} text-white text-sm px-4 py-2 rounded shadow transition-opacity\`}>
// //       {message}
// //     </div>
// //   );
// // };

// import React from "react";

// export function Toast({ message, type = "info" }) {
//   const color =
//     type === "success"
//       ? "bg-green-500"
//       : type === "error"
//       ? "bg-red-500"
//       : "bg-gray-700";

//   return (
//     <div
//       className={`${color} text-white text-sm px-4 py-2 rounded shadow transition-opacity`}
//     >
//       {message}
//     </div>
//   );
// }

// src/components/molecules/Toast.jsx
import React, { useEffect } from 'react';

export const Toast = ({ show, onClose, message, duration = 3000 }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-xs p-3 bg-card border border-border rounded shadow-lg text-text animate-fade-in"
      style={{ animation: 'fadeIn 0.3s, fadeOut 0.5s 2.5s forwards' }}
    >
      {message}
    </div>
  );
};