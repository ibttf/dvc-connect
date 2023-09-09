import React, {useState} from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import About from "../pages/About"
import Navbar from './Navbar';
const App = () => {
  const [language,setLanguage]=useState("english")
    return (
      <div  className="bg-green-100 min-h-screen h-max">
        <Routes>

          <Route path="/about" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage}/>
              <About/>
            </div>
          } />
          <Route path="/:day/:hours/:subject/:topic" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage}/>
              <Tutors language={language}/>
            </div>
          } />
          <Route path="/tutor-login" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage}/>
              <Login/>
            </div>
          } />
          <Route path="*" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage}/>
              <Home/>
            </div>
          } />

        </Routes>
        </div>
    );
}

export default App;
