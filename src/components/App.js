import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import About from "../pages/About"
const App = () => {
    return (
        <Routes>

          <Route path="/about" element={
            <div className="">
              <About />
            </div>
          } />
          <Route path="/:language/:day/:hours" element={
            <div className="">
              <Tutors />
            </div>
          } />
          <Route path="/tutor-login" element={
            <div className="">
              <Login />
            </div>
          } />
          <Route path="*" element={
            <div className="">
              <Home />
            </div>
          } />

        </Routes>
    );
}

export default App;
