import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import WrappedMainPage from "./pages/MainPage";
import HostelPage from "./pages/HostelPage";
import UploadPage from "./pages/UploadPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import FavouritesPage from "./pages/FavouritesPage";
import "bootstrap/dist/css/bootstrap.min.css";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/mainpage" element={<WrappedMainPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;