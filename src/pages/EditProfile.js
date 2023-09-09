import React, { useState, useEffect, useRef } from "react";
import { getFirestore, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function EditProfile() {
    const subjectMapping = {
        Math: ["Algebra", "Trigonometry", "Geometry", "Pre-Calc", "Calc 1", "Calc 2", "Calc 3", "Differential Equations", "Discrete Mathematics"],
        Science: ["Biology", "Chemistry", "Physics"],
        English: ["Reading", "Writing"],
    };

    const navigate=useNavigate();
    const [fName,setFName]=useState("")
    const [lName,setLName]=useState("")
    const [email,setEmail]=useState("")
    const [workLocation, setWorkLocation] = useState('Math Lab');
    const [languagesSpoken, setLanguagesSpoken] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);
    const[subjectsTaught,setSubjectsTaught]=useState([])
    const [selectedTopics, setSelectedTopics] = useState([]);
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

    const handleTopicChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          setSelectedTopics(prev => [...prev, value]);
        } else {
          setSelectedTopics(prev => prev.filter(topic => topic !== value));
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
                    setSelectedTopics(userSnapshot.data().topicsTaught)
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
   
    <div className="mt-5 border-4 border-green-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
        <h1 className="font-bold text-center text-3xl mb-4 text-green-600">
            Hi, {fName} {lName}
        </h1>
        <h2 className="font-bold text-center mb-4 text-green-600">
            Edit Profile
        </h2>
        <form className="space-y-6">
            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1 font-semibold text-green-800">First Name: </h1>
                <input className="border rounded mt-2 p-2 w-full col-span-3" type="text" value={fName} onChange={(e)=>setFName(e.target.value)}></input>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1 font-semibold text-green-800">Last Name: </h1>
                <input className="border rounded mt-2 p-2 w-full col-span-3" type="text" value={lName} onChange={(e)=>setLName(e.target.value)}></input>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1 font-semibold text-green-800">Email: </h1>
                <input className="border rounded mt-2 p-2 w-full col-span-3" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
                    <h1 className="col-span-1 font-semibold text-green-800">I work in the: </h1>
                    <div className="relative col-span-3">
                        <select 
                            className="block appearance-none w-full bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
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

                    <div className="grid grid-cols-4 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="col-span-1 font-semibold text-green-800">There, I teach: </h1>
                        <div className="flex flex-wrap col-span-3 items-center">
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



                    <div className="grid grid-cols-4 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="col-span-1 font-semibold text-green-800">I am comfortable teaching: </h1>
                        <div className="col-span-3 space-y-4">
                            {Object.keys(subjectMapping).map(subject => (
                                subjectsTaught.includes(subject) && (
                                    <div key={subject} className="p-4 border rounded shadow-sm bg-white">
                                        <h2 className="font-medium text-green-600 mb-3">{subject}</h2>
                                        <div className="flex flex-wrap">
                                            {subjectMapping[subject].map(topic => (
                                                <label key={topic} className="inline-flex items-center m-1">
                                                    <input 
                                                        type="checkbox" 
                                                        className="hidden" 
                                                        value={topic}
                                                        checked={selectedTopics.includes(topic)}
                                                        onChange={handleTopicChange}
                                                    />
                                                    <span className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                                        ${selectedTopics.includes(topic) ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                                                    `}>
                                                        {topic}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>



            <div className="grid grid-cols-4 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="col-span-1 font-semibold text-green-800">On top of English, I can speak: </h1>
                        <div className="flex flex-wrap col-span-3 items-center">
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

            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1">Hours Available: </h1>
                    <div className="grid grid-cols-5 gap-4 mt-4 col-span-3 lg:text-md text-xs" onMouseUp={handleMouseUp}>
                        <div></div>
                        {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                            <div key={day} className="text-center font-semibold text-gray-700">
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
                                    <div className="font-semibold text-gray-600">{timeLabel}</div>
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



            <div className="grid grid-cols-2 gap-0">
                <button type="button" onClick={()=>setShowModal(true)} className="flex w-6/12 mx-auto justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    {isDeleteLoading ? "Loading" : "Delete Account"}
                </button>
                <button type="button" onClick={handleEditProfile} className="flex w-6/12 mx-auto justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    {isLoading ? "Loading" : "Submit Changes"}
                    </button>
            </div>
            {showModal && (
                <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-8">
                        <h2>Are you sure?</h2>
                        <p>Do you really want to delete your account? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
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
