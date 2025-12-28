import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Landing from "./pages/Landing.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4caf50", // Green theme for sustainability
      light: "#81c784",
      dark: "#388e3c",
    },
    secondary: {
      main: "#ff9800", // Orange accent
      light: "#ffb74d",
      dark: "#f57c00",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          backgroundImage: "none",
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/donor"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={["DONOR"]}>
                      <Layout>
                        <DonorDashboard />
                      </Layout>
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/ngo"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={["NGO"]}>
                      <Layout>
                        <NGODashboard />
                      </Layout>
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
