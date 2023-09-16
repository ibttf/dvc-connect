import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";


import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import AdminEditTutor from '../pages/AdminEditTutor';
import AdminCreateTutor from '../pages/AdminCreateTutor';
import About from "../pages/About";
import Navbar from './Navbar';
import Resources from '../pages/Resources';
import translation from '../translations';
import EditProfile from "../pages/EditProfile";
import AdminEditProfile from "../pages/AdminEditProfile";
import Typewriter from "./Typewriter"

const App = () => {
  const [userHasMatchingDoc, setUserHasMatchingDoc] = useState(false);
  const [adminHasMatchingDoc, setAdminHasMatchingDoc] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("english");
  const t = (text) => translation[language][text];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDocSnapshot = await getDoc(adminDocRef);
        const docSnapshot = await getDoc(userDocRef);
        
        setUserHasMatchingDoc(docSnapshot.exists());
        setCurrentUser(docSnapshot.exists() || adminDocSnapshot.exists());
        setAdminHasMatchingDoc(adminDocSnapshot.exists());

        if (adminDocSnapshot.exists()) {
          setLocation(adminDocSnapshot.data().location);
        }

      } else {
        setCurrentUser(false);
        setUserHasMatchingDoc(false);
        setAdminHasMatchingDoc(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (adminHasMatchingDoc) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage} t={t} />
        <Routes>
          <Route path="/create-tutor" element={<AdminCreateTutor location={location} adminUID={userId} />} />
          <Route path="/edit-tutor/:tid" element={<AdminEditTutor />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/resources" element={<Resources language={language} t={t} />} />
          <Route path="*" element={<AdminEditProfile />} />
        </Routes>
      </div>
    );
  } else if (userHasMatchingDoc) {
    return (
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage} t={t} />
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/about" element={<About language={language} />} />
          <Route path="/resources" element={<Resources language={language} t={t} />} />
          <Route path="*" element={<EditProfile />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <Navbar language={language} setLanguage={setLanguage} t={t} />
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/resources" element={<Resources language={language} t={t} />} />
          <Route path="/:day/:hours/:subject/:topic" element={<Tutors key={language} language={language} t={t} />} />
          <Route path="/tutor-login" element={<Login />} />
          <Route path="*" element={<Home language={language} t={t} userHasMatchingDoc={userHasMatchingDoc} adminHasMatchingDoc={adminHasMatchingDoc} />} />
        </Routes>
    </div>
  );
}

export default App;
