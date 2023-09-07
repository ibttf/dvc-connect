import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
const App = () => {
    return (
        <Routes>
          <Route path="/:language/:day/:hours" element={
            <div className="">
              <Tutors />
            </div>
          } />
          <Route path="/tutor-login" element={
            <div className="">
              <Home />
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
