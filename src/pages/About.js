import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"
const About = (props) => {

  return(
    <div>
      <div className="w-10/12 mx-auto mb-24">
        {/* LANGAUGE TOGGLE */}
        <div className="grid grid-cols-4 text-center mt-12">
          <div onClick={()=>props.setLanguage("english")} className={`${props.language=="english" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-black font-semibold text-lg rounded-t-lg`}>
            English
          </div>
          <div onClick={()=>props.setLanguage("chinese")} className={`${props.language=="chinese" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
            Chinese
          </div>
          <div onClick={()=>props.setLanguage("spanish")} className={`${props.language=="spanish" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
            Spanish
          </div>
          <div onClick={()=>props.setLanguage("korean")} className={`${props.language=="korean" ? "bg-blue-600" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
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

export default About;