import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"

import { auth } from "../config/firebase";
import EditProfile from "./EditProfile"
import { AiOutlineSearch } from 'react-icons/ai';
const Home = (props) => {
  const [dayOfTheWeek, setDayOfTheWeek] = useState('monday');
  const [hours,setHours]=useState("0900")
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
        <EditProfile />
      </div>
    )
  }
  return(
    <div className="pb-24">
      <div className="w-5/12 mx-auto bg-blue-100">
        {/* LANGAUGE TOGGLE */}

        <div className="h-fit border-4 border-blue-700 rounded-b-md py-24">
          <div className="w-9/12 mx-auto grid grid-cols-1 grid-rows-3 gap-12">
            <div className="grid grid-cols-4 items-center">
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
            <div className="grid grid-cols-4 items-center">
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
                        <option value="0900">9:00 AM</option>
                        <option value="0930">9:30 AM</option>
                        <option value="1000">10:00 AM</option>
                        <option value="1030">10:30 AM</option>
                        <option value="1100">11:00 AM</option>
                        <option value="1130">11:30 AM</option>
                        <option value="1200">12:00 PM</option>
                        <option value="1230">12:30 PM</option>
                        <option value="0100">01:00 PM</option>
                        <option value="0130">01:30 PM</option>
                        <option value="0200">02:00 PM</option>
                        <option value="0230">02:30 PM</option>
                        <option value="0300">03:00 PM</option>
                        <option value="0330">03:30 PM</option>
                        <option value="0400">04:00 PM</option>
                        <option value="0430">04:30 PM</option>
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
            <Link to={`/${dayOfTheWeek}/${hours}`} className="grid grid-cols-8 items-center w-4/12 mx-auto text-lg font-semibold py-4 px-6 border-2 rounded-full border-blue-700 bg-blue-700 text-white hover:bg-blue-900 hover:border-blue-900 duration-100">
              <AiOutlineSearch className="w-8 h-8 col-span-1"/><h2 className="text-center w-full col-span-7 text-xl"> Search</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;