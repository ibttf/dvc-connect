import React, { useState, useEffect, useRef } from "react";
import { getFirestore, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function EditProfile(props) {

    const navigate=useNavigate();
    const [fName,setFName]=useState("")
    const [lName,setLName]=useState("")
    const [email,setEmail]=useState("")
    const [workLocation, setWorkLocation] = useState('Math Lab');
    const [languagesSpoken, setLanguagesSpoken] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);
    const[subjectsTaught,setSubjectsTaught]=useState([])
    const [selectedCells, setSelectedCells] = useState({});
    const [showModal, setShowModal] = useState(false);
    const isDragging = useRef(false);



    const handleSubjectsTaughtChange = (event) => {
        const { value, checked } = event.target;
    
        if (checked && !subjectsTaught.includes(value)) {
            setSubjectsTaught(prevSubjectsTaught => [...prevSubjectsTaught, value]);
        } else if (!checked && subjectsTaught.includes(value)) {
            setSubjectsTaught(prevSubjectsTaught => prevSubjectsTaught.filter(subj => subj !== value));
        }
    };

    const handleLanguageChange = (event) => {
        const { value, checked } = event.target;

        if (checked && !languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => [...prevLanguages, value]);
        } else if (!checked && languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => prevLanguages.filter(lang => lang !== value));
        }
    };



    const handleMouseDown = (timeLabel, day) => {
        isDragging.current = true;
        toggleSelection(timeLabel, day);
    };

    const handleMouseEnter = (timeLabel, day) => {
        if (isDragging.current) {
            toggleSelection(timeLabel, day);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const toggleSelection = (timeLabel, day) => {
        setSelectedCells(prev => {
            const key = `${day}-${timeLabel}`;
            if (prev[key]) {
                const newSelection = { ...prev };
                delete newSelection[key];
                return newSelection;
            } else {
                return { ...prev, [key]: true };
            }
        });
    };


    async function handleEditProfile(e) {
        e.preventDefault();
        setIsLoading(true);
    
        const user = auth.currentUser;  // Get the current authenticated user

        if (!user) {
            console.error("No user is signed in");
            return;
        }
    
        const userDocRef = doc(db, 'users', user.uid);
    
        await updateDoc(userDocRef, {
            fName: fName,
            lName: lName,
            email: email,
            workLocation: workLocation,
            languagesSpoken: languagesSpoken,
            selectedCells: selectedCells
        });
    
        // Save token to local storage
        const token = await user.getIdToken();
        localStorage.setItem('accessToken', token);
        setIsLoading(false);
        navigate("/");
    }

    const confirmDelete = async (e) => {
        e.preventDefault();
        setIsDeleteLoading(true);

        try {
            const user = auth.currentUser;
            console.log(user);
            if (user) {
                const uid = user.uid;

                // Assuming your Firestore collection where you store user info is 'users'
                const userDocRef = doc(db, 'users', uid);
                console.log(userDocRef)
                await deleteDoc(userDocRef);

                // Optional: Sign the user out after deletion.
                await signOut(auth);

            }
        } catch (error) {
            console.error("Error deleting user's information: ", error);
        } finally {
            setIsDeleteLoading(false);
            setShowModal(false);
        }
    };


    //get info based on use effect and use that to display what we currently have

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const db = getFirestore();
                const uid = user.uid;  // Get UID from auth token
                const userDocRef = doc(db, 'users', uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    setSelectedCells(userSnapshot.data().selectedCells);
                    setWorkLocation(userSnapshot.data().workLocation)
                    setLanguagesSpoken(userSnapshot.data().languagesSpoken)
                    setEmail(userSnapshot.data().email)
                    setFName(userSnapshot.data().fName)
                    setLName(userSnapshot.data().lName)
                    setSubjectsTaught(userSnapshot.data().subjectsTaught || []);
                } else {
                    console.log("No such user!");
                }
            } else {
                console.log("No user is signed in");
            }
        });



    // Cleanup the listener on component unmount
    return () => unsubscribe();
}, []);



  return(
   
    <div className="bg-white shadow-3xl mb-12 md:mt-5 mt-2 md:p-8 p-3 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto ">
        <h1 className="font-bold text-center md:text-xl xs:text-lg text-sm uppercased mb-4 text-gray-900">
            Hi, {fName} {lName}
        </h1>
        <h2 className="font-semibold text-center md:text-lg xs:text-lg text-sm uppercase md:mb-4 mb-2 text-gray-600">
            Edit Profile
        </h2>
        <form className="space-y-6">
            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">First Name: </h1>
                <input className="border rounded mt-2 p-2 w-full md:col-span-3 col-span-5 md:text-md text-xxs" type="text" value={fName} onChange={(e)=>setFName(e.target.value)}></input>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">Last Name: </h1>
                <input className="border rounded mt-2 p-2 w-full md:col-span-3 col-span-5 md:text-md text-xxs" type="text" value={lName} onChange={(e)=>setLName(e.target.value)}></input>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">Email: </h1>
                <input className="border rounded mt-2 p-2 w-full md:col-span-3 col-span-5 md:text-md text-xxs" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                    <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">I work in the: </h1>
                    <div className="relative md:col-span-3 col-span-5">
                        <select 
                            className="md:text-md text-xxs block appearance-none w-full bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                        >
                            <option value="Math Lab">Math Lab</option>
                            <option value="English Lab">English Lab</option>
                            <option value="Reading Lab">Reading Lab</option>
                            <option value="Science Lab">Science Lab</option>
                            <option value="Social Studies Lab">Social Studies Lab</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-1.414-1.414a.999.999 0 0 0-1.414 0L10 10.586 7.121 7.707a.999.999 0 0 0-1.414 0L4.293 9.293a.999.999 0 0 0 0 1.414z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                    <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">There, I teach: </h1>
                        <div className="flex flex-wrap md:col-span-3 col-span-5 items-center md:text-md text-xxs">
                            {["Math", "English", "Science"].map(subject => (
                                <label key={subject} className="inline-flex items-center m-1 ">
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        value={subject}
                                        checked={subjectsTaught.includes(subject)}
                                        onChange={handleSubjectsTaughtChange}
                                    />
                                    <span className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                        ${subjectsTaught.includes(subject) ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'}
                                    `}>
                                        {subject}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>




            <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">On top of English, I can speak: </h1>
                        <div className="flex flex-wrap md:col-span-3 col-span-5 items-center md:text-md text-xxs">
                            {["Chinese", "Korean", "Spanish"].map(language => (
                                <label key={language} className="inline-flex items-center m-1 ">
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        value={language}
                                        checked={languagesSpoken.includes(language)}
                                        onChange={handleLanguageChange}
                                    />
                                    <span className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                        ${languagesSpoken.includes(language) ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'}
                                    `}>
                                        {language}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                        <h1 className="col-span-1 font-semibold text-green-800 lg:text-lg md:text-md text-xxs">Hours Available: </h1>
                        <div className="grid grid-cols-5 gap-4 mt-4 md:md:col-span-3 col-span-5 lg:text-md text-xs" onMouseUp={handleMouseUp}>
                            <div></div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                <div key={day} className="lg:text-md md:text-sm text-xxxs text-center font-semibold text-gray-700">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: 16 }, (_, i) => {
                                let hour = 9 + Math.floor(i / 2);
                                const period = hour >= 12 ? "PM" : "AM";
                                if (hour > 12) hour -= 12; 
                                const minute = i % 2 === 0 ? "00" : "30";
                                const timeLabel = `${hour}:${minute}${period}`;

                                return (
                                    <React.Fragment key={timeLabel}>
                                        <div className="lg:text-md md:text-sm text-xxxs font-semibold text-gray-600">{timeLabel}</div>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                            <div 
                                                key={day} 
                                                className={`w-10 h-10 border rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer ${selectedCells[`${day}-${timeLabel}`] ? 'bg-green-400' : 'bg-white hover:bg-gray-100'}`}
                                                onMouseDown={() => handleMouseDown(timeLabel, day)}
                                                onMouseEnter={() => handleMouseEnter(timeLabel, day)}
                                            ></div>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                    </div>



            <div className="w-full grid grid-cols-2 md:gap-0 ">
                <button type="button" onClick={()=>setShowModal(true)} className="md:text-md text-xxs flex md:w-10/12 w-10/12 mx-auto justify-center rounded-lg bg-red-600 md:px-3 md:py-2 font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    {isDeleteLoading ? "Loading" : "Delete Account"}
                </button>
                <button type="button" onClick={handleEditProfile} className="md:text-md text-xxs flex md:w-10/12 w-10/12 mx-auto justify-center rounded-lg bg-green-600 md:px-3 md:py-2 font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    {isLoading ? "Loading" : "Submit Changes"}
                    </button>
            </div>
            {showModal && (
                <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-2xl transform transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-4">Do you really want to delete your account? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-500 transition-colors duration-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </form>
    </div>

        


  )
}

export default EditProfile;
