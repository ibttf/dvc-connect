import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { signOut} from "firebase/auth";

import { auth } from '../config/firebase';

const Navbar = (props) => {
    const [currentUser,setCurrentUser]=useState(null)
    const [isLanguageDropdownVisible,setIsLanguageDropdownVisible]=useState(false);

    useEffect(() => {

      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
      return () => unsubscribe();  // Cleanup subscription on unmount
    
      },[])

      function capitalize(word) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }

    // ===================
 


    return (

    <nav className="flex justify-between lg:py-6 lg:px-4 py-3 px-2 border-b-4 border-blue-600" onClick={()=>setIsLanguageDropdownVisible(false)} style={{width: "100%"}}>
        <div className="flex items-center">
            <Link to="/" className="text-lg font-extrabold text-blue-600 cursor-pointer">
                DVC Awesome Connect
            </Link>
            <div className="relative mx-2">
                <div 
                    className={`cursor-pointer p-6 font-semibold text-lg duration-100 hover:scale-110 ${isLanguageDropdownVisible ? "scale-110": ""}`}
                    onClick={(e) => {e.stopPropagation(); setIsLanguageDropdownVisible(!isLanguageDropdownVisible)}}
                >
                    {capitalize(props.language)}
                    <span className="ml-2">&#9660;</span> {/* This is a down arrow Unicode character */}
                </div>
                {isLanguageDropdownVisible && (
                    <div className="absolute top-full mt-2 w-full border rounded bg-white">
                        {props.language !== "chinese" && (
                            <div onClick={() => {props.setLanguage("chinese"); setIsLanguageDropdownVisible(false);}} className="p-6 hover:bg-blue-100 cursor-pointer font-semibold text-lg duration-100">
                                Chinese
                            </div>
                        )}
                        {props.language !== "korean" && (
                            <div onClick={() => {props.setLanguage("korean"); setIsLanguageDropdownVisible(false);}} className="p-6 hover:bg-blue-100 cursor-pointer font-semibold text-lg duration-100">
                                Korean
                            </div>
                        )}
                        {props.language !== "spanish" && (
                            <div onClick={() => {props.setLanguage("spanish"); setIsLanguageDropdownVisible(false);}} className="p-6 hover:bg-blue-100 cursor-pointer font-semibold text-lg duration-100">
                                Spanish
                            </div>
                        )}
                        {props.language !== "english" && (
                            <div onClick={() => {props.setLanguage("english"); setIsLanguageDropdownVisible(false);}} className="p-6 hover:bg-blue-100 cursor-pointer font-semibold text-lg duration-100">
                                English
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        <div className={`w-fit grid grid-cols-2 gap-4 items-center`}>
            <Link to="/about" className="font-semibold hover:underline">
                About
            </Link>
            {currentUser ? 
            <button onClick={()=>{signOut(auth); localStorage.clear()}} className="font-semibold hover:underline">
                Logout
                
            </button>
            :
            <Link to="/tutor-login" className="font-semibold hover:underline">
                Tutor?
            </Link>
            }
           
        </div>
    </nav>

);
    
}

export default Navbar;