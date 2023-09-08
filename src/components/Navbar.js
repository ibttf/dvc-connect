import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut} from "firebase/auth";

import { auth } from '../config/firebase';

const Navbar = ({}) => {
    const [sticky,setSticky]=useState(false)
    const [currentUser,setCurrentUser]=useState(null)
  



    useEffect(() => {
      const handleScroll = () => {
        setSticky(window.scrollY > 0);
      };
      window.addEventListener("scroll", handleScroll);
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
      return () => unsubscribe();  // Cleanup subscription on unmount
    
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
            <Link to="/" className="text-lg font-extrabold text-blue-600 cursor-pointer">
                DVC Awesome Connect
            </Link>
        </div>
        <div className={`w-fit grid grid-cols-2 gap-4`}>
            <Link to="/about" className="font-semibold hover:underline">
                About
            </Link>
            {currentUser ? 
            <button onClick={()=>{signOut(auth); localStorage.clear()}} className="font-semibold hover:underline">
                Logout
                
            </button>
            :
            <Link to="/tutor-login" className="font-semibold hover:underline">
                Tutor?
            </Link>
            }
           
        </div>
    </nav>

);
    
}

export default Navbar;