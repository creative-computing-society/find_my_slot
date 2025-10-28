import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AlreadyRegistered from "./components/AlreadyRegistered";
import ThankYou from "./components/ThankYou";
import Ended from "./components/Ended";
import TrackProgress from "./components/TrackProgress";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/already-registered" element={<AlreadyRegistered />} />
        <Route path="/thankyou" element={<ThankYou />} /> */}
        <Route path="/track-progress" element={
          <ProtectedRoute>
            <TrackProgress />
          </ProtectedRoute>
          } />
        <Route path="/ended" element={<Ended />}/>
      </Routes>
    </Router>
  );
}

export default App;
