import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import korea from "../styles/korea.png";
import china from "../styles/china.png";
import us from "../styles/us.png";
import mexico from "../styles/mexico.png";
import logo from "../styles/dvc.png";
import { auth } from "../config/firebase";
import { AiOutlineUser, AiOutlineHome, AiOutlineBook } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { RxExit } from "react-icons/rx";

const Navbar = (props) => {
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] =
    useState(false);
  const [isMobileDropdownVisible, setIsMobileDropdownVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasToggledLanguage, setHasToggledLanguage] = useState(false);

  // Hide popup when the language is toggled
  useEffect(() => {
    if (hasToggledLanguage) {
      setShowPopup(false);
    }
  }, [hasToggledLanguage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileDropdownVisible(false);
      }
    };

    // Attach the resize event listener to the window.
    window.addEventListener("resize", handleResize);

    // Detach the resize event listener when the component unmounts.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative ">
      <div className={`relative opacity-100`}>
        <div className="opacity-100">
          <nav
            onClick={() => {
              setIsLanguageDropdownVisible(false);
              setIsMobileDropdownVisible(false);
            }}
            className="md:w-11/12 mx-auto font-medium"
          >
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <div className="flex items-center">
                <a href="/" className="flex items-center md:mr-6">
                  <img
                    src={logo}
                    className="md:h-8 h-6 md:mr-3 mr-1"
                    alt="DVC Logo"
                  />
                  <span className="text-green-800 self-center md:text-2xl text-xl font-semibold whitespace-nowrap ">
                    Connect
                  </span>
                </a>
                <ul className="hidden md:flex flex-col md:flex-row md:space-x-8">
                  <li>
                    <a
                      href="/"
                      className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resources"
                      className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0"
                    >
                      Resources
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
                    setHasToggledLanguage(true);
                  }}
                >
                  <button
                    type="button"
                    data-dropdown-toggle="language-dropdown-menu"
                    className={` z-50 inline-flex items-center font-medium justify-center xxs:px-4 md:px-2 px-1 py-2 text-ss text-gray-950 rounded-lg cursor-pointer ${
                      showPopup ? "bg-gray-100" : ""
                    } hover:bg-gray-100`}
                  >
                    {displayLanguage(props.language)}
                    <IoMdArrowDropdown
                      className={`md:w-5 md:h-5 w-4 h-4 ${
                        isLanguageDropdownVisible ? "rotate-180" : ""
                      } duration-200`}
                    />
                  </button>

                  <div
                    className={`z-40 ${
                      isLanguageDropdownVisible ? "absolute top-12" : "hidden"
                    } my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
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
                {props.currentUser ? (
                  <button
                    onClick={() => {
                      signOut(auth);
                      localStorage.clear();
                    }}
                    className="hidden md:block ml-4 py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-base text-sm md:hover:text-gray-900 md:p-0"
                  >
                    <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                      <RxExit style={{ fontSize: "24px", color: "#FF0000" }} />
                    </div>
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="ml-4 hidden md:block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-sm text-sm md:hover:text-gray-900 md:p-0"
                  >
                    <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full transition duration-300 ease-in-out">
                      <AiOutlineUser
                        style={{ fontSize: "24px", color: "#333" }}
                      />
                    </div>
                  </a>
                )}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileDropdownVisible(!isMobileDropdownVisible);
                    }}
                  >
                    <FaBars
                      className={`${
                        isMobileDropdownVisible ? "-rotate-90" : ""
                      } w-5 h-5 text-gray-800 duration-200`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`absolute top-12 right-4 z-50 bg-white shadow-lg rounded-lg w-64 ${
                isMobileDropdownVisible ? "block" : "hidden"
              }`}
            >
              <ul>
                <li>
                  <a
                    href="/"
                    className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <AiOutlineHome
                        style={{ fontSize: "24px", color: "#333" }}
                      />
                      <span className="ml-2 text-sm font-semibold">Home</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="/resources"
                    className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <AiOutlineBook
                        style={{ fontSize: "24px", color: "#333" }}
                      />
                      <span className="ml-2 text-sm font-semibold">
                        Resources
                      </span>
                    </div>
                  </a>
                </li>
                {props.currentUser ? (
                  <li>
                    <button
                      onClick={() => {
                        signOut(auth);
                        localStorage.clear();
                      }}
                      className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center ">
                        <RxExit style={{ fontSize: "24px", color: "red" }} />
                        <span className="ml-2 text-sm font-semibold">
                          Logout
                        </span>
                      </div>
                    </button>
                  </li>
                ) : (
                  <li>
                    <a
                      href="/login"
                      className="block py-2 pl-3 pr-4 text-gray-950 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <AiOutlineUser
                          style={{ fontSize: "24px", color: "#333" }}
                        />
                        <span className="ml-2 text-sm font-semibold">
                          Login
                        </span>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );

  function displayLanguage(language) {
    switch (language) {
      case "english":
        return renderLanguageImg(us, "English (US)");
      case "chinese":
        return renderLanguageImg(china, "中文 (繁體)");
      case "spanish":
        return renderLanguageImg(mexico, "Español");
      case "korean":
        return renderLanguageImg(korea, "한국");
      default:
        return <img className="w-6 h-4" src={us} />;
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
      <li
        onClick={() => {
          props.setLanguage(lang);
        }}
      >
        <a
          href="#"
          className="block px-4 py-2 md:text-sm text-xs text-gray-950 hover:bg-gray-100"
          role="menuitem"
        >
          <div className="inline-flex items-center">
            <img
              src={imgSrc}
              className="h-3.5 w-3.5 object-cover rounded-full mr-2"
            />
            {text}
          </div>
        </a>
      </li>
    );
  }
};

export default Navbar;
