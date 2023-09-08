import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"
const Home = () => {
  const [language,setLanguage]=useState("english")
  const [spokenLanguage, setSpokenLanguage] = useState('english');
  const [dayOfTheWeek, setDayOfTheWeek] = useState('monday');
  const [hours,setHours]=useState("0910")

  return(
    <div>
      <Navbar />
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
        <div className="h-fit border-2 border-black rounded-b-md py-12">
            <h1 className="font-bold text-center text-3xl text-gray-600">
                About Us
            </h1>
        </div>
      </div>
    </div>
  )
}

export default Home;