import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from "../components/Typewriter"
import "../styles/globals.css"

import { AiOutlineSearch } from 'react-icons/ai';


const Home = (props) => {
  const [dayOfTheWeek, setDayOfTheWeek] = useState('Monday');
  const [hours,setHours]=useState("0900")
  const [isDayOfTheWeekDropdownVisible,setIsDayOfTheWeekDropdownVisible]=useState(false);
  const [isHoursDropdownVisible,setIsHoursDropdownVisible]=useState(false);
  const [isSubjectDropdownVisible, setIsSubjectDropdownVisible]=useState(false);
  const [selectedSubject, setSelectedSubject]=useState("Math");
  const [selectedTopic, setSelectedTopic]=useState("Any");



  function formatHour(hour) {
    const intHour = parseInt(hour);
    const suffix = (intHour >= 900 && intHour < 1200) ? ' AM' : ' PM';
    return hour.slice(0,2) + ":" + hour.slice(2) + suffix;
  }


  return(
    <div className="lg:pb-24  lg:my-12 pb-12 my-6"     
    style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '70vh'
    }} onClick={()=>{
      setIsDayOfTheWeekDropdownVisible(false);
      setIsHoursDropdownVisible(false);
      setIsSubjectDropdownVisible(false);
    }}>
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <span
            data-br=":R2bcra:"
            data-brr={1}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              textDecoration: "inherit",
              maxWidth: '1024px'
            }}
          >
            {props.t("Find a Tutor Who Speaks")} 
            <Typewriter/>
          </span>
        </h1>


      <div className="md:w-108 w-11/12 mx-auto md:py-8 py-4">
        

        <div className="grid md:grid-cols-3 md:first-letter:gap-4 gap-2 grid-cols-1">
          {/* Day Dropdown */}
          <div className="flex flex-col space-y-2 items-start">
            <h1 className="text-md text-gray-600 font-medium">{props.t("Day")}:</h1>
            <div className="relative w-full">
              <button
                className="block w-full text-left text-md text-gray-900 py-2 px-3 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHoursDropdownVisible(false);
                  setIsDayOfTheWeekDropdownVisible(!isDayOfTheWeekDropdownVisible);
                }}
              >
                {props.t(dayOfTheWeek)}
                <svg className="fill-current h-4 w-4 transition-transform transform-gpu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                </svg>
              </button>
              {isDayOfTheWeekDropdownVisible && (
                <div className="absolute mt-1 w-full shadow-lg bg-white border border-gray-300 rounded z-10">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                    <button
                      key={day}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onClick={() => {
                        setDayOfTheWeek(day);
                        setIsDayOfTheWeekDropdownVisible(false);
                      }}
                    >
                      {props.t(day)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>




          {/* During Dropdown */}
          <div className="flex flex-col space-y-2 items-start">
            <h1 className="text-md text-gray-600 font-medium">{props.t("During")}:</h1>
            <div className="relative w-full">
              <button
                className="block w-full text-left text-md text-gray-900 py-2 px-3 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDayOfTheWeekDropdownVisible(false);
                  setIsHoursDropdownVisible(!isHoursDropdownVisible);
                }}
              >
                {formatHour(hours)}
                <svg className="fill-current h-4 w-4 transition-transform transform-gpu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                </svg>
              </button>
              {isHoursDropdownVisible && (
                <div className="whitespace-nowrap absolute mt-1 w-80 shadow-lg bg-white border border-gray-300 rounded z-10 grid grid-cols-3 gap-2">
                  {["0900", "0930", "1000", "1030", "1100", "1130", "1200", "1230", "0100", "0130", "0200", "0230", "0300", "0330", "0400", "0430"].map(hour => (
                    <button
                      key={hour}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onClick={() => {
                        setHours(hour);
                        setIsHoursDropdownVisible(false);
                      }}
                    >
                      {formatHour(hour)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Subject Dropdown */}
          <div className="flex flex-col space-y-2 items-start">
            <h1 className="text-md text-gray-600 font-medium">{props.t("Subject")}:</h1>
            <div className="relative w-full">
              <button
                className="block w-full text-left text-md text-gray-900 py-2 px-3 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSubjectDropdownVisible(!isSubjectDropdownVisible);
                }}
              >
                {props.t(selectedSubject)}
                <svg className="fill-current h-4 w-4 transition-transform transform-gpu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                </svg>
              </button>
              {isSubjectDropdownVisible && (
                <div className="absolute mt-1 w-full shadow-lg bg-white border border-gray-300 rounded z-10">
                  {["Math", "English", "Science"].map(subject => (
                    <button
                      key={subject}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onClick={() => {
                        setSelectedTopic("Any");
                        setSelectedSubject(subject);
                        setIsSubjectDropdownVisible(false);
                      }}
                    >
                      {props.t(subject)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>



          </div>
        </div>

        <Link 
          to={`/${dayOfTheWeek}/${hours}/${selectedSubject}/${selectedTopic}`} 
          className="md:w-1/12 mx-auto inline-flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 active:bg-indigo-800 transition duration-300"
        >
          <AiOutlineSearch className="w-5 h-5 mr-2" />
          <h2 className="text-base">Search</h2>
        </Link>

        </div>
  )
}

export default Home;