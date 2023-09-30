import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/globals.css"

import { AiOutlineSearch } from 'react-icons/ai';

const PreHome = (props) => {

    return (
        <div className="pb-48 lg:pb-12 my-6 flex flex-col justify-center lg:h-1000 h-full  ">

            {/* Title */}
            <h1 className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
                <span className="inline-block vertical-align-top max-w-1024px">
                    {props.t("What School Do You Go To?")}
                </span>
            </h1>


        {/* School Options */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 mb-16 w-9/12 mx-auto">
            {["Laney", "Diablo Valley College - Pleasant Hill", "Diablo Valley College - San Ramon", "Berkeley City College", "College of Alameda", "Merritt College", "Contra Costa"].map(schoolOption => (
                <Link 
                    to={`/${schoolOption}`} 
                    key={schoolOption}
                    className="text-center flex items-center justify-center w-64 h-16 px-6 py-3 text-base bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl focus:outline-none transform transition-transform hover:scale-105"
                >
                    {schoolOption}
                </Link>
            ))}
        </div>


            {/* <button 
                className="mt-8 mx-auto w-64 px-6 bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition focus:outline-none flex justify-between items-center" 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsSchoolDropdownVisible(!isSchoolDropdownVisible);
                }}>
                {school || props.t("Select a School")}
                <span className="ml-2">
                    <svg className="fill-current h-5 w-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-.707-.707a.999.999 0 0 0-1.414 0L10 11.586 7.414 8.172a.999.999 0 0 0-1.414 0l-.707.707a.999.999 0 0 0 0 1.414z" />
                    </svg>
                </span>
            </button>

            {isSchoolDropdownVisible && (
            <div className="origin-top-center mt-2 mx-auto w-64  -mb-48 shadow-xl bg-white border border-gray-200 rounded-lg overflow-hidden z-50">
                {["Laney", "Diablo Valley College - Pleasant Hill", "Diablo Valley College - San Ramon", "Berkeley City College", "College of Alameda", "Merritt College", "Contra Costa"].map(schoolOption => (
                    <button
                        key={schoolOption}
                        className="block w-full text-left px-12 py-3 text-gray-700 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-100 transition"
                        onClick={() => {
                            setSchool(schoolOption);
                            setIsSchoolDropdownVisible(false);
                        }}
                    >
                        {schoolOption}
                    </button>
                ))}
            </div>
            )} */}


        </div>
    );
}

export default PreHome;
