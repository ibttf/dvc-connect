import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"

import { auth } from "../config/firebase";
import { signOut} from "firebase/auth";
import EditProfile from "./EditProfile"
const Home = () => {
  const [language,setLanguage]=useState("english")
  const [spokenLanguage, setSpokenLanguage] = useState('chinese');
  const [dayOfTheWeek, setDayOfTheWeek] = useState('monday');
  const [hours,setHours]=useState("0910")
  const [currentUser, setCurrentUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();  // Cleanup subscription on unmount
  }, []);



  if (currentUser){
    return(
      <div>
        <Navbar />
        <EditProfile />
      </div>
    )
  }
  return(
    <div>
      <Navbar />
        <button onClick={()=>console.log(auth?.currentUser?.email)}>get current user</button>
        <button onClick={()=>{signOut(auth); localStorage.clear()}}>Logout</button>
      <div className="w-10/12 mx-auto mb-24">
        {/* LANGAUGE TOGGLE */}
        <div className="grid grid-cols-4 text-center mt-12">
          <div onClick={()=>setLanguage("english")} className={`${language=="english" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-black font-semibold text-lg rounded-t-lg`}>
            English
          </div>
          <div onClick={()=>setLanguage("chinese")} className={`${language=="chinese" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
            Chinese
          </div>
          <div onClick={()=>setLanguage("spanish")} className={`${language=="spanish" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
            Spanish
          </div>
          <div onClick={()=>setLanguage("korean")} className={`${language=="korean" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
            Korean
          </div>
        </div>
        <div className="h-fit border-2 border-black rounded-b-md py-24">
          <div className="w-9/12 mx-auto grid grid-cols-1 grid-rows-4 gap-12">
            <div className="grid grid-cols-4">
              <h1 className="text-lg font-semibold text-right col-span-1 flex w-full">
                I speak 

              </h1>
              <div className="col-span-3">
                  <div className="relative">
                      <select
                          id="language"
                          value={spokenLanguage}
                          onChange={(e)=>setSpokenLanguage(e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                          <option value="chinese">Chinese</option>
                          <option value="korean">Korean</option>
                          <option value="spanish">Spanish</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                          </svg>
                      </div>
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-4">
            <h1 className="text-lg font-semibold text-right col-span-1 flex w-full">
                Looking for

              </h1>
              <div className="col-span-3">
                  <div className="relative">
                      <select
                          id="language"
                          value={dayOfTheWeek}
                          onChange={(e)=>setDayOfTheWeek(e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                          </svg>
                      </div>
                  </div>
        </div>
            </div>
            <div className="grid grid-cols-4">
            <h1 className="text-lg font-semibold text-right col-span-1 flex w-full">
                During

              </h1>
              <div className="col-span-3">
                  <div className="relative">
                      <select
                          id="language"
                          value={hours}
                          onChange={(e)=>setHours(e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="910">9:00 AM-10:00 AM</option>
                        <option value="1011">10:00 AM-11:00 AM</option>
                        <option value="1112">11:00 AM-12:00 PM</option>
                        <option value="1201">12:00 PM-1:00 PM</option>
                        <option value="0102">1:00 PM-2:00 PM</option>
                        <option value="0203">2:00 PM-3:00 PM</option>
                        <option value="0304">3:00 PM-4:00 PM</option>
                        <option value="0405">4:00 PM-5:00 PM</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                          </svg>
                      </div>
                  </div>
        </div>
            </div>

          </div>
          <div className="w-full text-center">
            <Link to={`/${spokenLanguage}/${dayOfTheWeek}/${hours}`} className="text-lg font-semibold py-4 px-6 border-2 rounded-full border-blue-700 bg-blue-700 text-white hover:bg-blue-900 hover:border-blue-900 duration-100">
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;