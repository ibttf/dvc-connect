import React, {useState} from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import About from "../pages/About"
import Navbar from './Navbar';
import Resources from '../pages/Resources';
import translation from '../translations';

const App = () => {
  const [language,setLanguage]=useState("english")
  const t=(text)=>{
    return (translation[language][text])
}
    return (
      <div  className=" min-h-screen h-max">
        <Routes>

          <Route path="/about" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage} t={t}/>
              <About language={language}  t={t}/>
            </div>
          }/>
          <Route path="/resources" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage} t={t}/>
              <Resources language={language}  t={t}/>
            </div>
          }/>
          <Route path="/:day/:hours/:subject/:topic" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage} t={t}/>
              <Tutors key={language} language={language} t={t}/>
            </div>
          }/>
          <Route path="/tutor-login" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage} t={t}/>
              <Login t={t}/>
            </div>
          }/>
          <Route path="*" element={
            <div className="">
              <Navbar language={language} setLanguage={setLanguage} t={t}/>
              <Home language={language}  t={t}/>
            </div>
          }/>

        </Routes>
        </div>
    );
}

export default App;
