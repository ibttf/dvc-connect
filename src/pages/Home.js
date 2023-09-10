import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"
import "../styles/globals.css"
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";  // Assuming you've set up Firestore in firebase.js
import EditProfile from "./EditProfile"
import { AiOutlineSearch } from 'react-icons/ai';

const Home = (props) => {
  const [dayOfTheWeek, setDayOfTheWeek] = useState('monday');
  const [hours,setHours]=useState("0900")
  const [isDayOfTheWeekDropdownVisible,setIsDayOfTheWeekDropdownVisible]=useState(false);
  const [isHoursDropdownVisible,setIsHoursDropdownVisible]=useState(false);
  const [isSubjectDropdownVisible, setIsSubjectDropdownVisible]=useState(false);
  const [isTopicDropdownVisible, setIsTopicDropdownVisible]=useState(false);
  const [selectedSubject, setSelectedSubject]=useState("Math");
  const [selectedTopic, setSelectedTopic]=useState("Any");
  const subjectMapping = {
    Math: ["Algebra", "Trigonometry", "Geometry", "Pre-Calc", "Calc 1", "Calc 2", "Calc 3", "Differential Equations", "Discrete Mathematics"],
    Science: ["Biology", "Chemistry", "Physics"],
    English: ["Reading", "Writing"],
};



  const [userHasMatchingDoc, setUserHasMatchingDoc] = useState(false);


  function formatHour(hour) {
    const intHour = parseInt(hour);
    const suffix = (intHour >= 900 && intHour < 1200) ? ' AM' : ' PM';
    return hour.slice(0,2) + ":" + hour.slice(2) + suffix;
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if a document exists for this user
        const userDocRef = doc(db, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
  
          setUserHasMatchingDoc(true);
        } else {
          setUserHasMatchingDoc(false);
        }
      } else {
        setUserHasMatchingDoc(false);
      }
    });
  
    return () => unsubscribe();  // Cleanup subscription on unmount
  }, []);



  if (userHasMatchingDoc){
    return(
      <div>
        <EditProfile />
      </div>
    )
  }
  return(
    <div className="lg:pb-24  lg:my-12 pb-12 my-6" onClick={()=>{
      setIsDayOfTheWeekDropdownVisible(false);
      setIsHoursDropdownVisible(false);
    }}>
      <div className="md:w-11/12 sm:w-10/12 w-9/12 flex justify-center mb-6">
        <h2 class="mx-auto w-fit lg:text-3xl text-xs font-semibold text-green-800">
          <span>Find a Tutor That Speaks</span>
          <div class="rw-words rw-words-1">
            <span>English</span>
            <span>Spanish</span>
            <span>Chinese</span>
            <span>Korean</span>
          </div>
        </h2>
      </div>
      <div className="md:w-108 w-11/12 mx-auto bg-green-800 bg-opacity-50">
        {/* LANGUAGE TOGGLE */}

        <div className="h-fit md:py-12 py-4">
          <div className="md:w-9/12 w-11/12 mx-auto grid grid-cols-1 grid-rows-2 lg:gap-6 gap-3">
            <div className="grid grid-cols-4 items-center bg-white lg:py-4 py-1 px-8 rounded-lg">
                <h1 className="lg:text-lg md:text-md text-xs font-bold text-right col-span-1 flex w-full">
                    Day:
                </h1>
                <div className="col-span-3">
                    <div className="relative">
                        <div 
                            className=" block w-full lg:text-lg md:text-md text-xs text-gray-900 py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                            onClick={(e) => {e.stopPropagation();
                                              setIsHoursDropdownVisible(false);
                                              setIsDayOfTheWeekDropdownVisible(!isDayOfTheWeekDropdownVisible)}}
                        >
                            {dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1)}
                            <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className={`fill-current h-4 w-4 ${isDayOfTheWeekDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                                </svg>
                            </span>
                        </div>
                        {isDayOfTheWeekDropdownVisible && (
                            <div className="absolute w-full border-green-600 rounded mt-5 bg-white z-10 text-gray-600">
                                {["monday", "tuesday", "wednesday", "thursday", "friday"].map(day => (
                                    <div
                                        key={day}
                                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer  lg:text-lg md:text-md text-xs"
                                        onClick={() => {
                                            setDayOfTheWeek(day);
                                            setIsDayOfTheWeekDropdownVisible(false);
                                        }}
                                    >
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-4 items-center bg-white lg:py-4 py-1 px-8 rounded-lg">
              <h1 className="lg:text-lg md:text-md text-xs font-semibold text-right col-span-1 flex w-full ">
                  During:
              </h1>
              <div className="col-span-3">
                  <div className="relative">
                      <div 
                          className="lg:text-lg md:text-md text-xs text-gray-900 block w-full py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                          onClick={(e) => {e.stopPropagation(); setIsDayOfTheWeekDropdownVisible(false); setIsHoursDropdownVisible(!isHoursDropdownVisible);}}
                      >
                          {formatHour(hours)}
                          <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className={`fill-current h-4 w-4 ${isHoursDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                              </svg>
                          </span>
                      </div>
                      {isHoursDropdownVisible && (
                          <div className="absolute border border-green-600 mx-auto grid md:grid-cols-4 grid-cols-2 gap-0 w-max rounded mt-5 bg-white z-10 text-gray-600 whitespace-nowrap lg:text-lg md:text-md text-xxs">
                              {["0900", "0930", "1000", "1030", "1100", "1130", "1200", "1230", "0100", "0130", "0200", "0230", "0300", "0330", "0400", "0430"].map(hour => (
                                  <div
                                      key={hour}
                                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-center"
                                      onClick={() => {
                                          setHours(hour);
                                          setIsHoursDropdownVisible(false);
                                      }}
                                  >
                                      {formatHour(hour)}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>







            <div className="grid grid-cols-4 items-center bg-white lg:py-4 py-1 px-8 rounded-lg">
              <h1 className="lg:text-lg md:text-md text-xs font-semibold text-right col-span-1 flex w-full">
                  Subject:
              </h1>
              <div className="col-span-3 relative">
                  <div 
                      className="lg:text-lg md:text-md text-xs text-gray-900 block w-full py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                      onClick={(e) => {
                          e.stopPropagation();
                          setIsTopicDropdownVisible(false);
                          setIsSubjectDropdownVisible(!isSubjectDropdownVisible);
                      }}
                  >
                      {selectedSubject}
                      <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className={`fill-current h-4 w-4 ${isSubjectDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                                </svg>
                            </span>
                  </div>
                  {isSubjectDropdownVisible && (
                      <div className="lg:text-lg md:text-md text-xs absolute border border-green-600 mx-auto w-full rounded mt-5 bg-white z-10 text-gray-600">
                          {["Math", "English", "Science"].map(subject => (
                              <div
                                  key={subject}
                                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                      setSelectedTopic("Any")
                                      setSelectedSubject(subject);
                                      setIsSubjectDropdownVisible(false);
                                  }}
                              >
                                  {subject}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>

            <div className="grid grid-cols-4 items-center bg-white lg:py-4 py-1 px-8 rounded-lg">
              <h1 className="lg:text-lg md:text-md text-xs font-semibold text-right col-span-1 flex w-full">
                  Topic:
              </h1>
              <div className="col-span-3 relative">
                  <div 
                      className="lg:text-lg md:text-md text-xs text-gray-900 block w-full py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                      onClick={(e) => {
                          e.stopPropagation();
                          setIsSubjectDropdownVisible(false);
                          setIsTopicDropdownVisible(!isTopicDropdownVisible);
                      }}
                  >
                      {selectedTopic}
                      <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className={`fill-current h-4 w-4 ${isTopicDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                                </svg>
                            </span>
                  </div>
                  {isTopicDropdownVisible && (
                      <div className="lg:text-lg md:text-md text-xs absolute border border-green-600 mx-auto w-full rounded mt-5 bg-white z-10 text-gray-600">
                          {
                              {
                                  'Math': ["Any", "Algebra", "Trigonometry", "Geometry", "Pre-Calc", "Calc 1", "Calc 2", "Calc 3", "Differential Equations", "Discrete Mathematics"],
                                  'English': ["Any", "Reading", "Writing"],
                                  'Science': ["Any", "Physics", "Chemistry", "Biology"]
                              }[selectedSubject]?.map(topic => (
                                  <div
                                      key={topic}
                                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-left"
                                      onClick={() => {
                                          setSelectedTopic(topic);
                                          setIsTopicDropdownVisible(false);
                                      }}
                                  >
                                      {topic}
                                  </div>
                              ))
                          }
                      </div>
                  )}
              </div>
          </div>





          </div>
          <div className="w-full text-center md:mt-12 mt-6">
            <Link to={`/${dayOfTheWeek}/${hours}/${selectedSubject}/${selectedTopic}`} style={{width: "9em"}} className="grid grid-cols-8 items-center mx-auto text-lg font-semibold md:py-4 md:px-6 py-2 px-12 border-2 rounded-full border-green-700 bg-green-700 text-white hover:bg-green-900 hover:border-green-900 duration-100">
              <AiOutlineSearch className="lg:w-6 lg:h-6 w-4 h-4 col-span-1"/><h2 className="text-center w-full col-span-7 lg:text-xl md:text-md text-sm"> Search</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;