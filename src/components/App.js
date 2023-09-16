import React, {useState, useEffect} from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import AdminEditTutor from '../pages/AdminEditTutor';
import AdminCreateTutor from '../pages/AdminCreateTutor';
import About from "../pages/About"
import Navbar from './Navbar';
import Resources from '../pages/Resources';
import translation from '../translations';
import EditProfile from "../pages/EditProfile"
import AdminEditProfile from "../pages/AdminEditProfile"
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";  // Assuming you've set up Firestore in firebase.js
const App = () => {
  const [userHasMatchingDoc, setUserHasMatchingDoc] = useState(false);
  const [adminHasMatchingDoc,setAdminHasMatchingDoc]=useState(false);
  const [currentUser,setCurrentUser]=useState(false);
  const [userId,setUserId]=useState("")
  const [location,setLocation]=useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if a document exists for this user
        setUserId(user.uid)
        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef=doc(db, 'admins', user.uid);
        const adminDocSnapshot=await getDoc(adminDocRef)
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          setUserHasMatchingDoc(true);
          setCurrentUser(true)
        } else {
          setUserHasMatchingDoc(false);
        }
        if (adminDocSnapshot.exists()) {
          setCurrentUser(true)
          setAdminHasMatchingDoc(true);
          setLocation(adminDocSnapshot.data().location)
        } else {
          setAdminHasMatchingDoc(false);
        }

      } 
      else {
        setCurrentUser(false)
        setUserHasMatchingDoc(false);
        setAdminHasMatchingDoc(false);
      }

      
    });
  
    return () => unsubscribe();  // Cleanup subscription on unmount
  }, []);


  const [language,setLanguage]=useState("english")
  const t=(text)=>{
    return (translation[language][text])
  }

  if(adminHasMatchingDoc){
    // ADMIN LOGGED IN
    return (
      <div  className=" min-h-screen h-max font-nuno bg-green-650">
        <Routes>
            <Route path="/create-tutor" element={
              <div className="" >
                <Navbar language={language} setLanguage={setLanguage}/>
                <AdminCreateTutor location={location} adminUID={userId}/>
                {/* <AdminEditTutor/> */}
              </div>
            }/>
          <Route path="/edit-tutor/:tid" element={
              <div className="" >
                <Navbar language={language} setLanguage={setLanguage}/>
                <AdminEditTutor/>
              </div>
            }/>
          <Route path="/admin-login" element={
              <div className="" >
                <Navbar language={language} setLanguage={setLanguage}/>
                <AdminLogin/>
              </div>
            }/>
            <Route path="/resources" element={
              <div className="" >
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <Resources language={language} t={t}/>
              </div>
            }/>
            <Route path="*" element={
              <div className="">
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <AdminEditProfile />
              </div>
            }/>
        </Routes>
        </div>
    );
  }else if (userHasMatchingDoc){
    //TUTOR IS LOGGED IN
    return (
      <div  className=" min-h-screen h-max font-nuno bg-green-650">
        <Routes>
          <Route path="/admin-login" element={
              <div className="" >
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <AdminLogin/>
              </div>
            }/>
            <Route path="/about" element={
              <div className="">
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <About language={language} />
              </div>
            }/>
            <Route path="/resources" element={
              <div className="" >
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <Resources language={language} t={t}/>
              </div>
            }/>
            <Route path="*" element={
              <div className="">  
                <Navbar currentUser={currentUser} language={language} setLanguage={setLanguage}/>
                <EditProfile />
              </div>
            }/>
        </Routes>
        </div>
    );
  }

  //NO ONE IS LOGGED IN
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
                <Home language={language}  t={t} userHasMatchingDoc={userHasMatchingDoc} adminHasMatchingDoc={adminHasMatchingDoc}/>
              </div>
            }/>
        </Routes>
        </div>    
  );
}

export default App;
