"use client";

import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AiOutlineSearch, AiOutlineUser} from "react-icons/ai"
import {VscThreeBars} from "react-icons/vsc"








const Navbar = ({}) => {
    const navigate=useNavigate();
    const [open,setOpen]=useState(false);
    const [sticky,setSticky]=useState(false)
    const [loginPopup,setLoginPopup]=useState(0); //0 for neither, 1 for login, 2 for signup
    const [navbarExpand,setNavbarExpand]=useState(false);
    const [location,setLocation]=useState(false);
    const [rooms,setRooms]=useState(false)
    const [movein,setMovein]=useState(false)
    const [amenities,setAmenities]=useState(false);

    //DYNAMIC STATE STUFF FOR THE SEARCH BAR INPUT
    const [searchInput,setSearchInput]=useState("")
    const [guests,setGuests]=useState(1);

  
  
    useEffect(() => {
      const handleScroll = () => {
        setSticky(window.scrollY > 0);
      };
      window.addEventListener("scroll", handleScroll);
    
      },[])




    // ========DATE TIME POPUP===========
    const [startDate,setStartDate]=useState(new Date())
    const [endDate,setEndDate]=useState(new Date())


    const handleSelect=(ranges)=>{
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
    }
    const selectionRange={
        startDate: startDate,
        endDate:endDate,
        key: "selection"
    }
    // ===================
 


    return (

    <nav className="flex justify-between lg:py-6 lg:px-4 py-3 px-2 border-b-4 border-blue-600" style={{width: "100%"}}>
        <div>
            <h1 className="text-lg font-extrabold text-blue-600 cursor-pointer" onClick={()=>window.location.reload()}>
                DVC Awesome Connect
            </h1>
        </div>
        <div className="w-fit grid grid-cols-2 gap-4">
            <Link to="/about" className="font-semibold hover:underline" onClick={()=>navigate.push("/tutor-signin")}>
                About
            </Link>
            <Link to="/tutor-login" className="font-semibold hover:underline" onClick={()=>navigate.push("/tutor-signin")}>
                Tutor?
            </Link>
        </div>
    </nav>

);
    
}

export default Navbar;