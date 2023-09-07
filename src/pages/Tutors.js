import React, {useState,useEffect} from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
const Tutors = () => {
    let {language,day,hours}=useParams();
    const [mainLanguage,setMainLanguage]= useState('english')

    let tutors=[
        "Abraham Shostokovitch"
    ]
  
    return(
      <div>
        <Navbar />
        <div className="w-10/12 mx-auto mb-24">
          {/* LANGUAGE TOGGLE */}
          <div className="grid grid-cols-4 text-center mt-12">
            <div onClick={()=>setMainLanguage("english")} className={`${mainLanguage=="english" ? "bg-blue-300" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-black font-semibold text-lg rounded-t-lg`}>
              English
            </div>
            <div onClick={()=>setMainLanguage("chinese")} className={`${mainLanguage=="chinese" ? "bg-blue-300" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
              Chinese
            </div>
            <div onClick={()=>setMainLanguage("spanish")} className={`${mainLanguage=="spanish" ? "bg-blue-300" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
              Spanish
            </div>
            <div onClick={()=>setMainLanguage("korean")} className={`${mainLanguage=="korean" ? "bg-blue-300" : "bg-gray-100"} opacity-80 hover:opacity-100 cursor-pointer p-6 border-x-2 border-t-2 border-l-0 border-black font-semibold text-lg rounded-t-lg`}>
              Korean
            </div>
          </div>
          <div className=" border-2 border-black rounded-b-md py-6 text-center text-xl">
            <h1>
                Looking for  
                <span className='font-semibold text-2xl'> {language[0].toUpperCase()}{language.substring(1)} </span>
                tutors on 
                <span className='font-semibold text-2xl'> {day[0].toUpperCase()}{day.substring(1)} </span>
                from 
                <span className='font-semibold text-2xl'> {hours.substring(0,2)}{["09","10","11"].includes(hours.substring(0,2)) ? "AM": "PM" } to {hours.substring(2,4)}{["09","10","11"].includes(hours.substring(2,4)) ? "AM": "PM" } </span>
            </h1>
          </div>

                  {/* RESULTS */}
        <div>
            {
                tutors.map((tutor)=>{return(
                    <div>
                        {tutor}
                    </div>
                )})
            }
        </div>
        </div>


      </div>
    )
}

export default Tutors;
