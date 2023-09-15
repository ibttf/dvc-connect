import React, {useState, useEffect} from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import About from "../pages/About"
import Navbar from './Navbar';
import Resources from '../pages/Resources';
import translation from '../translations';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";  // Assuming you've set up Firestore in firebase.js
const App = () => {
  const [userHasMatchingDoc,setUserHasMatchingDoc]=useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // Check if a document exists for this user
        const userDocRef = doc(db, 'users', userAuth.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          setUserHasMatchingDoc(true);

          // 2. Set the user data to the user state
          setUser({ uid: userAuth.uid, ...docSnapshot.data() });

        } else {
          setUserHasMatchingDoc(false);
          setUser(null);  // Ensure the user state is null if no matching document is found
        }
      } else {
        setUserHasMatchingDoc(false);
        setUser(null);  // Ensure the user state is null if no user is authenticated
      }
    });    
    return () => unsubscribe();  // Cleanup subscription on unmount
  }, []);


  const [language,setLanguage]=useState("english")
  const t=(text)=>{
    return (translation[language][text])
  }


    return (
      <div  className=" min-h-screen h-max font-nuno bg-green-650">
        {
          
        }
        <Routes>
          <Route path="/admin-login" element={
              <div className="" >
                <Navbar language={language} setLanguage={setLanguage} t={t}/>
                <AdminLogin t={t}/>
              </div>
            }/>
            <Route path="/about" element={
              <div className="">
                <Navbar language={language} setLanguage={setLanguage} t={t}/>
                <About language={language}  t={t}/>
              </div>
            }/>
            <Route path="/resources" element={
              <div className="" >
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
