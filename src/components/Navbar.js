import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { signOut} from "firebase/auth";
import korea from "../styles/korea.png"
import china from "../styles/china.png"
import us from "../styles/us.png"
import mexico from "../styles/mexico.png"
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

 
    // ===================
 


    return (

    <nav className="lg:text-lg md:text-md text-xxs flex justify-between lg:py-6 lg:px-4 py-3 px-2 border-b-4 border-green-600" onClick={()=>setIsLanguageDropdownVisible(false)} style={{width: "100%"}}>
        <div className="flex items-center">
            <Link to="/" className=" font-extrabold text-green-600 cursor-pointer">
                DVC Connect
            </Link>
            <div className="relative mx-0 z-20">
                <div 
                    className={`text-md cursor-pointer px-2 font-semibold duration-100 hover:underline ${isLanguageDropdownVisible ? "underline": ""}`}
                    onClick={(e) => {e.stopPropagation(); setIsLanguageDropdownVisible(!isLanguageDropdownVisible)}}
                >
                    {displayLanguage(props.language)}
                    
                </div>
                {isLanguageDropdownVisible && (
                    <div className="absolute top-full mt-2 w-max border rounded bg-white">
                        {props.language !== "chinese" && (
                            <div onClick={() => {props.setLanguage("chinese"); setIsLanguageDropdownVisible(false);}} className="flex items-center md:p-6 p-3 hover:bg-green-50 cursor-pointer font-semibold duration-100">
                                <img className="md:w-6 md:h-4 w-3 h-2 md:mr-2 mr-0.5" src={china} />Chinese
                            </div>
                        )}
                        {props.language !== "korean" && (
                            <div onClick={() => {props.setLanguage("korean"); setIsLanguageDropdownVisible(false);}} className="flex items-center md:p-6 p-3 hover:bg-green-50 cursor-pointer font-semibold duration-100">
                                <img className="md:w-6 md:h-4 w-3 h-2 md:mr-2 mr-0.5" src={korea} />Korean
                            </div>
                        )}
                        {props.language !== "spanish" && (
                            <div onClick={() => {props.setLanguage("spanish"); setIsLanguageDropdownVisible(false);}} className="flex items-center md:p-6 p-3 hover:bg-green-50 cursor-pointer font-semibold duration-100">
                                <img className="md:w-6 md:h-4 w-3 h-2 md:mr-2 mr-0.5" src={mexico} />Spanish
                            </div>
                        )}
                        {props.language !== "english" && (
                            <div onClick={() => {props.setLanguage("english"); setIsLanguageDropdownVisible(false);}} className="flex items-center md:p-6 p-3 hover:bg-green-50 cursor-pointer font-semibold duration-100">
                                <img className="md:w-6 md:h-4 w-3 h-2 md:mr-2 mr-0.5" src={us} />English
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        <div className={`w-fit grid grid-cols-2 md:gap-4 gap-1 items-center`}>
            <Link to="/about" className="font-bold hover:underline text-green-600">
                About
            </Link>
            {currentUser ? 
            <button onClick={()=>{signOut(auth); localStorage.clear()}} className="font-bold hover:underline text-green-600">
                Logout
                
            </button>
            :
            <Link to="/tutor-login" className="font-bold hover:underline text-green-600">
                TutorZone
            </Link>
            }
           
        </div>
    </nav>

);
    
function displayLanguage(language){
    switch(language) {
        case "english":
         return(
            <img className="md:w-6 md:h-4 w-3 h-2" src={us} />
           
         )
          
        case "chinese":
         return(
            <img className="md:w-6 md:h-4 w-3 h-2" src={china} />
           
         )
          
        case "spanish":
         return(
            <img className="md:w-6 md:h-4 w-3 h-2" src={mexico} />
           
         )
          
        case "korean":
         return(
            <img className="md:w-6 md:h-4 w-3 h-2" src={korea} />
           
         )
          
        default:
         return(
            <img className="w-6 h-4" src={us} />
           
         )
      }
      
}
}

export default Navbar;