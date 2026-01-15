// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AppRoutes from "./routes/AppRoutes";
// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <Navbar />
//         <main className="main-content">
//           <AppRoutes />
//         </main>
//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;







// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AppRoutes from "./routes/AppRoutes";
// import LiveKitWidgetSticky from "./components/ai_avatar/LiveKitWidgetSticky";
// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <Navbar />

//         <main className="main-content">
//           <AppRoutes />
//         </main>

//         <Footer />

//         {/* Sticky AI Assistant on all pages */}
//         <LiveKitWidgetSticky />
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;





import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import LiveKitWidgetSticky from "./components/ai_avatar/LiveKitWidgetSticky";


function AppContent() {
  const location = useLocation();
  
  // Hum component ko hamesha render karenge, render ke andar logic handle karenge
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />

      {/* Logic component ke andar bhej rahe hain */}
      <LiveKitWidgetSticky mode="sticky" currentPath={location.pathname} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;



