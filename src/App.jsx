// // import React, { useEffect } from 'react';
// // import { Routes, Route, Link, useLocation } from 'react-router-dom';
// // import Builder from './routes/Builder';
// // import Kanban from './routes/Kanban';
// // import DesignSystemDemo from './routes/DesignSystemDemo';
// // import { useTheme } from './state/theme';

// // export default function App() {
// //   const { theme, toggle } = useTheme();
// //   const loc = useLocation();
// //   useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

// //   return (
// //     <div className='app-shell'>
// //       <aside className='sidebar'>
// //         <h3>Board & Builder</h3>
// //         <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
// //           <Link to='/builder' className='btn'>Layout Builder</Link>
// //           <Link to='/kanban' className='btn'>Kanban Board</Link>
// //           <Link to='/design' className='btn'>Design System</Link>
// //         </nav>
// //         <div style={{ marginTop: 20 }}>
// //           <button onClick={toggle} className='btn btn-primary'>Toggle theme</button>
// //         </div>
// //       </aside>
// //       <main className='main'>
// //         <div className='header'>
// //           <h2>{loc.pathname === '/' ? 'Welcome' : loc.pathname.replace('/', '')}</h2>
// //         </div>
// //         <Routes>
// //           <Route path='/' element={<div>Open Builder or Kanban.</div>} />
// //           <Route path='/builder' element={<Builder />} />
// //           <Route path='/kanban' element={<Kanban />} />
// //           <Route path='/design' element={<DesignSystemDemo />} />
// //         </Routes>
// //       </main>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-900">
// //       <h1 className="text-5xl font-bold text-red-500">
// //         Tailwind is Working!
// //       </h1>
// //     </div>
// //   );
// // }


// import React, { useEffect } from "react";
// import { Routes, Route, Link, useLocation, NavLink } from "react-router-dom";
// import Builder from "./routes/Builder";
// import Kanban from "./routes/Kanban";
// import DesignSystemDemo from "./routes/DesignSystemDemo";
// import { useTheme } from "./state/theme";

// export default function App() {
//   const { theme, toggle } = useTheme();
//   const loc = useLocation();

//   useEffect(() => {
//     document.title = theme === "dark" ? "Dark Mode" : "Light Mode";
//   }, [theme]);


//   return (
//     <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
//         <div>
//           <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
//             Board & Builder
//           </h2>

//           <nav className="flex flex-col gap-3">
//             <Link
//               to="/builder"
//               className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
//             >
//               🧱 Layout Builder
//             </Link>
//             <Link
//               to="/kanban"
//               className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
//             >
//               📋 Kanban Board
//             </Link>
//             {/* <Link
//               to="/design"
//               className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
//             >
//               🎨 Design System
//             </Link> */}
//             <NavLink
//   to="/design"
//   className={({ isActive }) =>
//     `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//       isActive
//         ? "bg-blue-600 text-white dark:bg-blue-500"
//         : "hover:bg-blue-100 dark:hover:bg-blue-900"
//     }`
//   }
// >
//   🎨 Design System
// </NavLink>
//           </nav>
//         </div>

//         <button
//           onClick={toggle}
//           className="mt-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
//         >
//           Toggle {theme === "dark" ? "Light" : "Dark"} Mode
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col overflow-y-auto">
//         <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 sticky top-0 z-10">
//           <h1 className="text-xl font-semibold capitalize">
//             {loc.pathname === "/"
//               ? "Welcome"
//               : loc.pathname.replace("/", "").replace("-", " ")}
//           </h1>
//         </header>

//         <section className="p-6 flex-1 overflow-y-auto">
//           <Routes>
//             <Route path="/" element={<div>Open Builder or Kanban.</div>} />
//             <Route path="/builder" element={<Builder />} />
//             <Route path="/kanban" element={<Kanban />} />
//             <Route path="/design" element={<DesignSystemDemo />} />
//           </Routes>
//         </section>
//       </main>
//     </div>
//   );
// }

// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { AppLayout } from './components/layout/AppLayout';
import { LayoutBuilder } from './pages/LayoutBuilder';
import { KanbanBoard } from './pages/KanbanBoard';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/builder" element={<LayoutBuilder />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/" element={<LayoutBuilder />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}