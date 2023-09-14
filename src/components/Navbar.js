import React, {useState, useEffect} from 'react';
import { signOut} from "firebase/auth";
import korea from "../styles/korea.png"
import china from "../styles/china.png"
import us from "../styles/us.png"
import mexico from "../styles/mexico.png"
import logo from "../styles/dvc.png"
import { auth } from '../config/firebase';

const Navbar = (props) => {
    const [currentUser,setCurrentUser]=useState(null)
    const [isLanguageDropdownVisible,setIsLanguageDropdownVisible]=useState(false);
    const [isMobileDropdownVisible,setIsMobileDropdownVisible]=useState(false);
    useEffect(() => {

        // Function to update state based on window size
        const handleResize = () => {
          if (window.innerWidth > 1024) {
            setIsMobileDropdownVisible(false);
          }
        };
      
        // Set initial state based on window size
        handleResize();
      
        // Add event listener
        window.addEventListener('resize', handleResize);
      
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
          }
        });
      
        // Cleanup event listener and subscription on unmount
        return () => {
          window.removeEventListener('resize', handleResize);
          unsubscribe();
        };
      
      }, []);


    return (
    <div className="shadow-sm bg-green-800 bg-opacity-40">

    <nav onClick={(e)=>{setIsLanguageDropdownVisible(false); setIsMobileDropdownVisible(false)}} className=" w-11/12 mx-auto font-medium ">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
        <img
            src={logo}
            className="md:h-8 xxs:h-4 h-3 md:mr-3 mr-1"
            alt="DVC Logo"
        />
        <span className="text-green-800 self-center md:text-2xl xxs:text-sm text-xs font-semibold whitespace-nowrap ">
            Connect
        </span>
        </a>
        <div className="flex items-center md:order-2" onClick={(e)=>{e.stopPropagation(); setIsLanguageDropdownVisible(!isLanguageDropdownVisible)}}>
        <button 
            type="button"
            data-dropdown-toggle="language-dropdown-menu"
            className="inline-flex items-center font-medium justify-center xxs:px-4 px-2 py-2 md:text-sm text-xs text-green-950  rounded-lg cursor-pointer hover:bg-gray-100"
        >

            {displayLanguage(props.language)}
        </button>
        {/* Dropdown */}
        <div 
            className={`z-50 ${isLanguageDropdownVisible ? "absolute top-12" : "hidden"} my-4 md:text-base text-sm list-none bg-white divide-y divide-gray-100 rounded-lg shadow`}
            id="language-dropdown-menu"
        >
            <ul className="py-2 font-medium" role="none">
            <li onClick={()=>{
                                props.setLanguage("english")}}>
                <a
                href="#"
                className="block px-4 py-2 md:text-sm text-xs text-green-950 hover:bg-gray-100"
                role="menuitem"
                >
                <div className="inline-flex items-center">
                <img src={us}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                    English (US)
                </div>
                </a>
            </li>


            <li onClick={()=>{
                                props.setLanguage("spanish")}}>
                <a
                href="#"
                className="block px-4 py-2 md:text-sm text-xs text-green-950 hover:bg-gray-100"
                role="menuitem"
                >
                <div className="inline-flex items-center">
                <img src={mexico}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                    Español
                </div>
                </a>
            </li>
            <li onClick={()=>{                                
                                props.setLanguage("korean")}}>
                <a
                href="#"
                className="block px-4 py-2 md:text-sm text-xs text-green-950 hover:bg-gray-100"
                role="menuitem"
                >
                <div className="inline-flex items-center">
                <img src={korea}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                    한국
                </div>
                </a>
            </li>

            <li onClick={()=>{
                                props.setLanguage("chinese")}}>
                <a
                href="#"
                className="block px-4 py-2 md:text-sm text-xs text-green-950 hover:bg-gray-100"
                role="menuitem"
                >
                <div className="inline-flex items-center">
                <img src={china}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                    中文 (繁體)
                </div>
                </a>
            </li>
            </ul>
        </div>
        <button onClick={(e)=>{e.stopPropagation(); setIsMobileDropdownVisible(!isMobileDropdownVisible)}}
            data-collapse-toggle="navbar-language"
            type="button"
            className="inline-flex items-center p-2 md:w-10 md:h-10 w-8 h-8 justify-center md:text-sm text-xs text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-language"
            aria-expanded="false"
        >
            <span className="sr-only">Open main menu</span>
            <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
            />
            </svg>
        </button>
        </div>
        <div
        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-language"
        >
        <ul className="flex flex-col font-medium  md:p-0 p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md">
            <li>
            <a
                href="/"
                className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0"
            >
                Home
            </a>
            </li>
            <li>
            <a
                href="/resources"
                className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0"
            >
                Resources
            </a>
            </li>

            {currentUser ? 
                <li>
                    <button onClick={()=>{signOut(auth); localStorage.clear()}} className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0">
                        Logout
                    </button>
                </li>
                :
                <li>
                    <a href="/tutor-login" className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0">
                    TutorZone
                    </a>
                </li>
                }

        </ul>
        </div>
        {
            isMobileDropdownVisible ? 
            <div
            className="items-center justify-between w-full md:hidden"
            id="navbar-language"
            >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white md">
                <li>
                <a
                    href="/"
                    className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0"
                >
                    Home
                </a>
                </li>
                <li>
                <a
                    href="/resources"
                    className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0"
                >
                    Resources
                </a>
                </li>
                {currentUser ? 
                    <li>
                        <button onClick={()=>{signOut(auth); localStorage.clear()}} className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0">
                            Logout
                        </button>
                    </li>
                    :
                    <li>
                        <a href="/tutor-login" className="block py-2 pl-3 pr-4 text-green-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-green-900 md:p-0">
                        TutorZone
                        </a>
                    </li>
                    }
    
            </ul>
            </div>
            :
            <></>
        }

    </div>
    </nav>

    </div>

);
    
function displayLanguage(language){
    switch(language) {
        case "english":
         return(
           <div className="inline-flex items-center">
            <img src={us}
            className="h-3.5 w-3.5 rounded-full mr-2" />
                    
            English (US)
           </div>
         )
          
        case "chinese":
         return(
            <div className="inline-flex items-center">
                <img src={china}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                中文 (繁體)
            </div>
         )
          
        case "spanish":
         return(
            <div className="inline-flex items-center">
            <img src={mexico}
                className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
            Español
           </div>
         )
          
        case "korean":
         return(
            <div className="inline-flex items-center">
                <img src={korea}
                    className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                    
                한국
            </div>
         )
          
        default:
         return(
            <img className="w-6 h-4" src={us} />
           
         )
      }
      
}
}

export default Navbar;