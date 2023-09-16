import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

      <div className="md:w-108 w-11/12 mx-auto bg-white md:py-8 py-4 rounded-3xl mainShadow">
        <div className="md:w-11/12 sm:w-10/12 w-9/12 flex justify-center mb-6">
          <h2 class={`${props.language=="spanish" ? "pl-6": "pl-20"} mr-auto w-fit md:text-xl xs:text-lg text-sm font-semibold text-gray-800 `}>
            <span>{props.t("Find a Tutor Who Speaks")}</span>
            <div class="rw-words rw-words-1">
              <span>English</span>
              <span>Español</span>
              <span>中文 (繁體)</span>
              <span>한국</span>
            </div>
          </h2>
        </div>

        <div className="h-fit ">
          <div className="md:w-9/12 w-11/12 mx-auto grid grid-cols-1 grid-rows-2 gap-3">
            <div className="grid grid-cols-4 items-center bg-white lg:py-0 px-8">
                <h1 className="md:text-md text-sm uppercase font-semibold text-right col-span-1 flex w-full">
                {props.t("Day")}:
                </h1>
                <div className="col-span-3">
                    <div className="relative">
                        <div 
                            className=" block w-full md:text-md text-sm text-gray-900 py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                            onClick={(e) => {e.stopPropagation();
                                              setIsHoursDropdownVisible(false);
                                              setIsDayOfTheWeekDropdownVisible(!isDayOfTheWeekDropdownVisible)}}
                        >
                            {props.t(dayOfTheWeek)}
                            <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className={`fill-current h-4 w-4 ${isDayOfTheWeekDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                                </svg>
                            </span>
                        </div>
                        {isDayOfTheWeekDropdownVisible && (
                            <div className="absolute w-full rounded mt-5 bg-white z-10 text-gray-600 border">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                                    <div
                                        key={day}
                                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer  md:text-md text-sm"
                                        onClick={() => {
                                            setDayOfTheWeek(day);
                                            setIsDayOfTheWeekDropdownVisible(false);
                                        }}
                                    >
                                        {props.t(day)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-4 items-center bg-white lg:py-0 px-8">
              <h1 className="md:text-md text-sm uppercase font-semibold text-right col-span-1 flex w-full ">
              {props.t("During")}:
              </h1>
              <div className="col-span-3">
                  <div className="relative">
                      <div 
                          className="md:text-md text-sm text-gray-900 block w-full py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
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
                          <div className="absolute border mx-auto grid md:grid-cols-4 grid-cols-2 gap-0 w-max rounded mt-5 bg-white z-10 text-gray-600 whitespace-nowrap lg:text-md md:text-md text-sm">
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


            <div className="grid grid-cols-4 items-center bg-white lg:py-0 px-8">
              <h1 className="md:text-md text-sm uppercase font-semibold text-right col-span-1 flex w-full">
              {props.t("Subject")}:
              </h1>
              <div className="col-span-3 relative">
                  <div 
                      className="md:text-md text-sm text-gray-900 block w-full py-3 px-4 pr-8 rounded leading-tight cursor-pointer"
                      onClick={(e) => {
                          e.stopPropagation();
                          setIsSubjectDropdownVisible(!isSubjectDropdownVisible);
                      }}
                  >
                      {props.t(selectedSubject)}
                      <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className={`fill-current h-4 w-4 ${isSubjectDropdownVisible ? "rotate-180" : ""} duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                                </svg>
                            </span>
                  </div>
                  {isSubjectDropdownVisible && (
                      <div className="md:text-md text-sm absolute border mx-auto w-full rounded mt-5 bg-white z-10 text-gray-600">
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
                                  {props.t(subject)}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>


          </div>
          <div className="w-9/12 text-center mt-6 mx-auto">
            <Link to={`/${dayOfTheWeek}/${hours}/${selectedSubject}/${selectedTopic}`} className="search-btn shadow-lg grid grid-cols-8 items-center mx-auto text-lg font-semibold md:py-2 md:px-4 py-2 px-12 border-2 rounded-full  bg-gray-950 text-white hover:bg-gray-800 duration-100">
              <AiOutlineSearch className="md:w-5 md:h-5 w-4 h-4 col-span-1"/><h2 className="text-center w-full col-span-7 md:text-md text-sm"> Search</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;