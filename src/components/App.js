import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import PreHome from "../pages/PreHome";
import Home from "../pages/Home";
import Tutors from "../pages/Tutors";
import AdminLogin from "../pages/AdminLogin";
import AdminEditTutor from "../pages/AdminEditTutor";
import AdminCreateTutor from "../pages/AdminCreateTutor";
import Navbar from "./Navbar";
import Resources from "../pages/Resources";
import translation from "../translations";
import AdminEditProfile from "../pages/AdminEditProfile";
import Loading from "../pages/Loading";

const App = () => {
  const [loading, setLoading] = useState(true);
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
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDocSnapshot = await getDoc(adminDocRef);

        setCurrentUser(adminDocSnapshot.exists());
        setAdminHasMatchingDoc(adminDocSnapshot.exists());

        if (adminDocSnapshot.exists()) {
          setLocation(adminDocSnapshot.data().location);
        }
      } else {
        setCurrentUser(false);
        setAdminHasMatchingDoc(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <Loading />
      </div>
    );
  }

  if (adminHasMatchingDoc) {
    return (
      <div className="min-h-screen overflow-y-auto w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <Navbar
          currentUser={currentUser}
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
        <Routes>
          <Route
            path="/:school/create-tutor"
            element={<AdminCreateTutor location={location} adminUID={userId} />}
          />
          <Route path="/:school/edit-tutor/:tid" element={<AdminEditTutor />} />
          <Route path="/:school/login" element={<AdminLogin />} />
          <Route
            path="/:school/resources"
            element={<Resources language={language} t={t} />}
          />
          <Route path="*" element={<AdminEditProfile />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="fixed min-h-screen overflow-y-auto w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <Routes>
        <Route
          path="/:school/resources"
          element={
            <>
              <Navbar language={language} setLanguage={setLanguage} t={t} />
              <Resources language={language} t={t} />
            </>
          }
        />

        <Route
          path="/:school/:day/:hours/:subject/:topic"
          element={
            <>
              <Navbar language={language} setLanguage={setLanguage} t={t} />
              <Tutors key={language} language={language} t={t} />
            </>
          }
        />

        <Route
          path="/:school/login"
          element={
            <>
              <Navbar language={language} setLanguage={setLanguage} t={t} />
              <AdminLogin />
            </>
          }
        />

        <Route
          path="/:school/"
          element={
            <>
              <Navbar language={language} setLanguage={setLanguage} t={t} />
              <Home
                language={language}
                t={t}
                adminHasMatchingDoc={adminHasMatchingDoc}
              />
            </>
          }
        />

        <Route path="*" element={<PreHome language={language} t={t} />} />
      </Routes>
    </div>
  );
};

export default App;
