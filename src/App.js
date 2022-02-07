import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";

import { Container } from "semantic-ui-react";
import AuthRoute from "./utils/authRoute";
import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import SinglePost from "./pages/singlePost";
function App() {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <Container>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthRoute />}>
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/posts/:postId" element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
