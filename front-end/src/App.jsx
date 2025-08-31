import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import './css/App.css';
import AuthRoute from './components/AuthRoute';
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "./components/UserContext";

// Import Components
import NavBar from './components/NavBar';
import FlatPageNavBar from './components/FlatPageNavBar';
import ThemeSidebar from './components/ThemeSidebar/ThemeSidebar';

// Import Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import FlatPage from './pages/FlatPage';
import Games from './pages/Games';
import TicTacToe from './games/TicTacToe';
import EditDetails from './pages/EditDetails';
import ForgotPass from './pages/ForgotPass';

const themes = {
  blue: {
    '--primary-colour': 'var(--pastel-blue-400)',
    '--primary-colour-dark': 'var(--pastel-blue-700)',
    '--primary-colour-light': 'var(--pastel-blue-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-blue-300), var(--pastel-green-400))',
    '--primary-colour-50': 'var(--pastel-blue-50)',
    '--primary-colour-100': 'var(--pastel-blue-100)',
    '--primary-colour-200': 'var(--pastel-blue-200)',
    '--primary-colour-300': 'var(--pastel-blue-300)',
    '--primary-colour-400': 'var(--pastel-blue-400)',
    '--primary-colour-500': 'var(--pastel-blue-500)',
    '--primary-colour-600': 'var(--pastel-blue-600)',
    '--primary-colour-700': 'var(--pastel-blue-700)',
    '--primary-colour-800': 'var(--pastel-blue-800)',
    '--primary-colour-900': 'var(--pastel-blue-900)',
    '--primary-colour-950': 'var(--pastel-blue-950)',
  },
  red: {
    '--primary-colour': 'var(--pastel-red-400)',
    '--primary-colour-dark': 'var(--pastel-red-700)',
    '--primary-colour-light': 'var(--pastel-red-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-red-300), var(--pastel-pink-400))',
    '--primary-colour-50': 'var(--pastel-red-50)',
    '--primary-colour-100': 'var(--pastel-red-100)',
    '--primary-colour-200': 'var(--pastel-red-200)',
    '--primary-colour-300': 'var(--pastel-red-300)',
    '--primary-colour-400': 'var(--pastel-red-400)',
    '--primary-colour-500': 'var(--pastel-red-500)',
    '--primary-colour-600': 'var(--pastel-red-600)',
    '--primary-colour-700': 'var(--pastel-red-700)',
    '--primary-colour-800': 'var(--pastel-red-800)',
    '--primary-colour-900': 'var(--pastel-red-900)',
    '--primary-colour-950': 'var(--pastel-red-950)',
  },
  pink: {
    '--primary-colour': 'var(--pastel-pink-400)',
    '--primary-colour-dark': 'var(--pastel-pink-700)',
    '--primary-colour-light': 'var(--pastel-pink-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-pink-300), var(--pastel-purple-400))',
    '--primary-colour-50': 'var(--pastel-pink-50)',
    '--primary-colour-100': 'var(--pastel-pink-100)',
    '--primary-colour-200': 'var(--pastel-pink-200)',
    '--primary-colour-300': 'var(--pastel-pink-300)',
    '--primary-colour-400': 'var(--pastel-pink-400)',
    '--primary-colour-500': 'var(--pastel-pink-500)',
    '--primary-colour-600': 'var(--pastel-pink-600)',
    '--primary-colour-700': 'var(--pastel-pink-700)',
    '--primary-colour-800': 'var(--pastel-pink-800)',
    '--primary-colour-900': 'var(--pastel-pink-900)',
    '--primary-colour-950': 'var(--pastel-pink-950)',
  },
  purple: {
    '--primary-colour': 'var(--pastel-purple-400)',
    '--primary-colour-dark': 'var(--pastel-purple-700)',
    '--primary-colour-light': 'var(--pastel-purple-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-purple-300), var(--pastel-blue-400))',
    '--primary-colour-50': 'var(--pastel-purple-50)',
    '--primary-colour-100': 'var(--pastel-purple-100)',
    '--primary-colour-200': 'var(--pastel-purple-200)',
    '--primary-colour-300': 'var(--pastel-purple-300)',
    '--primary-colour-400': 'var(--pastel-purple-400)',
    '--primary-colour-500': 'var(--pastel-purple-500)',
    '--primary-colour-600': 'var(--pastel-purple-600)',
    '--primary-colour-700': 'var(--pastel-purple-700)',
    '--primary-colour-800': 'var(--pastel-purple-800)',
    '--primary-colour-900': 'var(--pastel-purple-900)',
    '--primary-colour-950': 'var(--pastel-purple-950)',
  },
  green: {
    '--primary-colour': 'var(--pastel-green-400)',
    '--primary-colour-dark': 'var(--pastel-green-700)',
    '--primary-colour-light': 'var(--pastel-green-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-green-300), var(--color-jet-stream-400))',
    '--primary-colour-50': 'var(--pastel-green-50)',
    '--primary-colour-100': 'var(--pastel-green-100)',
    '--primary-colour-200': 'var(--pastel-green-200)',
    '--primary-colour-300': 'var(--pastel-green-300)',
    '--primary-colour-400': 'var(--pastel-green-400)',
    '--primary-colour-500': 'var(--pastel-green-500)',
    '--primary-colour-600': 'var(--pastel-green-600)',
    '--primary-colour-700': 'var(--pastel-green-700)',
    '--primary-colour-800': 'var(--pastel-green-800)',
    '--primary-colour-900': 'var(--pastel-green-900)',
    '--primary-colour-950': 'var(--pastel-green-950)',
  },
  // neutrals (grays / backgrounds)
  neutral: {
    '--primary-colour': 'var(--whitesmoke-400)',
    '--primary-colour-dark': 'var(--whitesmoke-700)',
    '--primary-colour-light': 'var(--whitesmoke-100)',
    '--primary-gradient': 'linear-gradient(135deg, var(--whitesmoke-200), var(--whitesmoke-500))',
    '--primary-colour-50': 'var(--whitesmoke-50)',
    '--primary-colour-100': 'var(--whitesmoke-100)',
    '--primary-colour-200': 'var(--whitesmoke-200)',
    '--primary-colour-300': 'var(--whitesmoke-300)',
    '--primary-colour-400': 'var(--whitesmoke-400)',
    '--primary-colour-500': 'var(--whitesmoke-500)',
    '--primary-colour-600': 'var(--whitesmoke-600)',
    '--primary-colour-700': 'var(--whitesmoke-700)',
    '--primary-colour-800': 'var(--whitesmoke-800)',
    '--primary-colour-900': 'var(--whitesmoke-900)',
    '--primary-colour-950': 'var(--whitesmoke-950)',
  },
  teal: {
    '--primary-colour': 'var(--color-jet-stream-400)',
    '--primary-colour-dark': 'var(--color-jet-stream-700)',
    '--primary-colour-light': 'var(--color-jet-stream-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--color-jet-stream-300), var(--pastel-green-400))',
    '--primary-colour-50': 'var(--color-jet-stream-50)',
    '--primary-colour-100': 'var(--color-jet-stream-100)',
    '--primary-colour-200': 'var(--color-jet-stream-200)',
    '--primary-colour-300': 'var(--color-jet-stream-300)',
    '--primary-colour-400': 'var(--color-jet-stream-400)',
    '--primary-colour-500': 'var(--color-jet-stream-500)',
    '--primary-colour-600': 'var(--color-jet-stream-600)',
    '--primary-colour-700': 'var(--color-jet-stream-700)',
    '--primary-colour-800': 'var(--color-jet-stream-800)',
    '--primary-colour-900': 'var(--color-jet-stream-900)',
    '--primary-colour-950': 'var(--color-jet-stream-950)',
  },
  brown: {
    '--primary-colour': 'var(--color-almond-400)',
    '--primary-colour-dark': 'var(--color-almond-700)',
    '--primary-colour-light': 'var(--color-almond-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--color-almond-300), var(--pastel-red-400))',
    '--primary-colour-50': 'var(--color-almond-50)',
    '--primary-colour-100': 'var(--color-almond-100)',
    '--primary-colour-200': 'var(--color-almond-200)',
    '--primary-colour-300': 'var(--color-almond-300)',
    '--primary-colour-400': 'var(--color-almond-400)',
    '--primary-colour-500': 'var(--color-almond-500)',
    '--primary-colour-600': 'var(--color-almond-600)',
    '--primary-colour-700': 'var(--color-almond-700)',
    '--primary-colour-800': 'var(--color-almond-800)',
    '--primary-colour-900': 'var(--color-almond-900)',
    '--primary-colour-950': 'var(--color-almond-950)',
  },
};




/**
 * PublicLayout
 * Renders the standard NavBar for public-facing pages like Home, Login, etc.
 */
function PublicLayout() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Outlet /> {/* Renders the child route's component */}
      </main>
    </>
  );
}

/**
 * DashboardLayout
 * This is the main layout for the logged-in user experience.
 * It manages the dashboard navbar and the theme settings sidebar.
 */
function DashboardLayout({ toggleTheme }) {
  // 2. State to manage the sidebar's visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* 3. Pass the function to open the sidebar to the navbar */}
      <FlatPageNavBar onSettingsClick={() => setSidebarOpen(true)} />
      
      {/* 4. Render the sidebar and pass state to control it */}
      <ThemeSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggleTheme={toggleTheme} // Pass the function to the sidebar
        />
      
      <main className="main-content">
        <Outlet /> {/* Renders FlatPage, Games, etc. */}
      </main>
    </>
  );
}


function App() {
  const isLoggedIn = localStorage.getItem("keepLoggedIn");
  const { setUser } = useContext(UserContext);
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

   
  // Function to toggle between light and dark
  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the choice
  };

  useEffect(() => {
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(themeMode);
  }, [themeMode]);

  // 3. useEffect to load the saved mode on startup
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setThemeMode(savedMode);
    }

    const savedThemeName = localStorage.getItem('selectedTheme') || 'blue'; // Default to 'blue'
    const theme = themes[savedThemeName];
    if (theme) {
      const root = document.documentElement;
      Object.keys(theme).forEach((key) => {
        root.style.setProperty(key, theme[key]);
      });
    }
  }, []); // The empty array ensures this runs only once on startup


  return (
    <div className="App">
      <Routes>
        {/* --- Public Routes with Standard NavBar --- */}
        <Route element={<PublicLayout />}>
          <Route path='/' element={isLoggedIn ? <Navigate to="/flatpage" /> : <Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgotpassword' element={<ForgotPass />} />
        </Route>

        {/* --- Protected Dashboard Routes with Dashboard NavBar & Sidebar --- */}
        <Route element={<DashboardLayout toggleTheme={toggleThemeMode} />}>
          <Route path="/flatpage" element={<FlatPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/tictactoe" element={<TicTacToe />} />
          <Route path="/details" element={<EditDetails />} />
        </Route>

        {/* --- Redirect for any unknown routes --- */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
}

export default App;

// function App() {
//     const location = useLocation();
//     const isLoggedIn = localStorage.getItem("keepLoggedIn");

//     const { setUser } = useContext(UserContext);
//     useEffect(() => {
//         const storedUser = localStorage.getItem("userData");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, [setUser]);

//     // Define routes where you want the alternate navbar
//     const showDashboardNav = location.pathname === '/flatpage' || location.pathname.startsWith('/games') || location.pathname === '/details';

//     return (
//         <div className="App">
//             {showDashboardNav ? <FlatPageNavBar /> : <NavBar />}

//             <main className="main-content">
//                 <Routes>
//                     <Route path='/' element={isLoggedIn?<Navigate to={"/flatpage"}/>: <Home />} />
//                     <Route path='/register' element={<Register />} />
//                     <Route path='/login' element={<Login />} />
//                     <Route path="/flatpage" element={<FlatPage />} />
//                     <Route path="/games" element={<Games />} />
//                     <Route path="/games/tictactoe" element={<TicTacToe />} />
//                     <Route path="/details" element={<EditDetails />} />
//                     <Route path='/forgotpassword' element={<ForgotPass />} />
//                     <Route path='*' element={<Navigate to='/' replace />} /> {/* Redirects unknown routes to homepage */}
//                 </Routes>
//             </main>
//         </div>
//     );
// }

// export default App;
