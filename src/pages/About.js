import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar"
const About = (props) => {

  return(
    <div>
      <div className="w-10/12 mx-auto mb-24">

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