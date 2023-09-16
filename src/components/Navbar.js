import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import korea from "../styles/korea.png";
import china from "../styles/china.png";
import us from "../styles/us.png";
import mexico from "../styles/mexico.png";
import logo from "../styles/dvc.png";
import { auth } from '../config/firebase';
import {AiOutlineUser} from "react-icons/ai"
import {FaBars} from "react-icons/fa"
import {RxExit} from "react-icons/rx"

const Navbar = (props) => {
    const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);
    const [isMobileDropdownVisible, setIsMobileDropdownVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMobileDropdownVisible(false);
            }
        };

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
            <div className="">
                <nav onClick={() => { setIsLanguageDropdownVisible(false); setIsMobileDropdownVisible(false) }} className=" w-11/12 mx-auto font-medium ">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        
                        <div className="flex items-center">
                            <a href="/" className="flex items-center mr-6">
                                <img src={logo} className="h-8 md:mr-3 mr-1" alt="DVC Logo" />
                                <span className="text-green-800 self-center text-2xl font-semibold whitespace-nowrap ">Connect</span>
                            </a>
                            <ul className="hidden md:flex flex-col md:flex-row md:space-x-8">
                                <li>
                                    <a href="/" className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0">Home</a>
                                </li>
                                <li>
                                    <a href="/resources" className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0">Resources</a>
                                </li>
                            </ul>
                        </div>
                        <div className="hidden md:flex items-center">
                            <div onClick={(e) => { e.stopPropagation(); setIsLanguageDropdownVisible(!isLanguageDropdownVisible) }}>
                                <button
                                    type="button"
                                    data-dropdown-toggle="language-dropdown-menu"
                                    className="inline-flex items-center font-medium justify-center xxs:px-4 px-2 py-2 md:text-sm text-xs text-gray-950  rounded-lg cursor-pointer hover:bg-gray-100"
                                >
                                    {displayLanguage(props.language)}
                                </button>
                                <div
                                    className={`z-50 ${isLanguageDropdownVisible ? "absolute top-12" : "hidden"} my-4 md:text-base text-sm list-none bg-white divide-y divide-gray-100 rounded-lg shadow`}
                                    id="language-dropdown-menu"
                                >
                                    <ul className="py-2 font-medium" role="none">
                                        {renderLanguageOption("english", us, "English (US)")}
                                        {renderLanguageOption("spanish", mexico, "Español")}
                                        {renderLanguageOption("korean", korea, "한국")}
                                        {renderLanguageOption("chinese", china, "中文 (繁體)")}
                                    </ul>
                                </div>
                            </div>
                            {props.currentUser ?
                        <button onClick={() => { signOut(auth); localStorage.clear() }} className="ml-4 block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0">
                            <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                                <RxExit style={{ fontSize: '24px', color: '#FF0000' }} />
                            </div>
                        </button>
                                :
                            <a href="/tutor-login" className="ml-4 block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-sm text-sm md:hover:text-gray-900 md:p-0">
                                        <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                                            <AiOutlineUser style={{ fontSize: '24px', color: '#333' }} />
                                        </div>
                            </a>
                            }
                        </div>
                    
                <div className="md:hidden flex items-center">
                    <button onClick={(e) => { e.stopPropagation(); setIsMobileDropdownVisible(!isMobileDropdownVisible) }}>
                        <FaBars className={`${isMobileDropdownVisible ? "-rotate-90" : ""} duration-200`}/>
                    </button>
                </div>
                </div>
                <div className={`md:hidden ${isMobileDropdownVisible ? "block" : "hidden"}`}>
                    <ul>
                        <li>
                            <a href="/" className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100">Home</a>
                        </li>
                        <li>
                            <a href="/resources" className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100">Resources</a>
                        </li>
                         {props.currentUser ? 
                            <li>
                                <button onClick={() => { signOut(auth); localStorage.clear() }} className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100">
                                    <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                                        <RxExit style={{ fontSize: '24px', color: '#FF0000' }} />
                                    </div>
                                </button>
                            </li> :
                            <li>
                                <a href="/tutor-login" className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100">
                                <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                                    <AiOutlineUser style={{ fontSize: '24px', color: '#333' }} />
                                </div>
                                </a>
                            </li>
                        }
                        {/* ... Language options for mobile ... */}
                    </ul>
                </div>
            </nav>
        </div>
    );

    function displayLanguage(language) {
        switch (language) {
            case "english": return renderLanguageImg(us, "English (US)");
            case "chinese": return renderLanguageImg(china, "中文 (繁體)");
            case "spanish": return renderLanguageImg(mexico, "Español");
            case "korean": return renderLanguageImg(korea, "한국");
            default: return <img className="w-6 h-4" src={us} />;
        }
    }

    function renderLanguageImg(src, text) {
        return (
            <div className="inline-flex items-center">
                <img src={src} className="h-3.5 w-3.5 rounded-full mr-2" />
                {text}
            </div>
        );
    }

    function renderLanguageOption(lang, imgSrc, text) {
        return (
            <li onClick={() => { props.setLanguage(lang) }}>
                <a
                    href="#"
                    className="block px-4 py-2 md:text-sm text-xs text-gray-950 hover:bg-gray-100"
                    role="menuitem"
                >
                    <div className="inline-flex items-center">
                        <img src={imgSrc} className="h-3.5 w-3.5 object-cover rounded-full mr-2" />
                        {text}
                    </div>
                </a>
            </li>
        );
    }
}

export default Navbar;
