import React, { useState, useEffect, useRef } from "react";
import {db, auth} from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";


function Login(props) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [fName,setFName]=useState("")
  const [lName,setLName]=useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


  const [workLocation, setWorkLocation] = useState('Math Lab');
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const[subjectsTaught,setSubjectsTaught]=useState([])
  const [selectedTopics, setSelectedTopics] = useState([]);

    const subjectMapping = {
        Math: ["Algebra", "Trigonometry", "Geometry", "Pre-Calc", "Calc 1", "Calc 2", "Calc 3", "Differential Equations", "Discrete Mathematics"],
        Science: ["Biology", "Chemistry", "Physics"],
        English: ["Reading", "Writing"],
    };


    const handleLanguageChange = (event) => {
        const { value, checked } = event.target;

        if (checked && !languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => [...prevLanguages, value]);
        } else if (!checked && languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => prevLanguages.filter(lang => lang !== value));
        }
    };

    const handleSubjectsTaughtChange = (event) => {
        const { value, checked } = event.target;
    
        if (checked && !subjectsTaught.includes(value)) {
            setSubjectsTaught(prevSubjectsTaught => [...prevSubjectsTaught, value]);
        } else if (!checked && subjectsTaught.includes(value)) {
            setSubjectsTaught(prevSubjectsTaught => prevSubjectsTaught.filter(subj => subj !== value));
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

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [step, setStep] = useState(1);

    const [selectedCells, setSelectedCells] = useState({});
    const isDragging = useRef(false);

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

    function displaySelectedCells(selectedCells) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday"];
    
        const groupedSelections = days.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});
    
        for (const key in selectedCells) {
            const [day, time] = key.split('-');
            if (groupedSelections[day]) {
                groupedSelections[day].push(time);
            }
        }
    
        function formatRanges(times) {
            if (times.length === 0) return [];
        
            // Helper function to convert time to minutes for easier comparison
            const timeToMinutes = time => {
                const [hours, minutes] = time.split(/[:APM]+/).map(Number);
                return hours * 60 + minutes + (time.includes('PM') && hours !== 12 ? 720 : 0);
            };
        
            // Sort the times before processing
            times.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
        
            const ranges = [];
            let start = times[0];
            let end = times[0];
        
            for (let i = 1; i < times.length; i++) {
                if (timeToMinutes(times[i]) - timeToMinutes(end) === 30) {
                    end = times[i];
                } else {
                    ranges.push(start === end ? start : `${start} - ${end}`);
                    start = times[i];
                    end = times[i];
                }
            }
        
            ranges.push(start === end ? start : `${start} - ${end}`);
            return ranges;
        }
        
    
        return days.map(day => {
            const ranges = formatRanges(groupedSelections[day]);
            if (ranges.length > 0) {
                return `${day}: ${ranges.join(', ')}`;
            }
            return null;
        }).filter(Boolean).join('\n');
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log('User Credential:', userCredential);
                    localStorage.setItem('accessToken', userCredential.user.accessToken);
                    navigate("/");
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Login error:", err);
                    setErrors(["Invalid username or password."]);
                    setIsLoading(false);
                });
            console.log('User Credential:', userCredential);
            localStorage.setItem('accessToken', userCredential.user.accessToken);
            navigate("/")
        } catch (err) {
            console.error("Login error:", err); // It's good to log the error for debugging
            setErrors(["Invalid username or password."]);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleSignup(e) {
        e.preventDefault();
        setIsLoading(true);
    
        if (password !== passwordConfirmation) {
            setErrors(["Password does not match"]);
            setIsLoading(false);
            return;
        }
    
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Store additional data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                fName: fName,
                lName: lName,
                workLocation: workLocation,
                languagesSpoken: languagesSpoken,
                selectedCells: selectedCells,
                subjectsTaught: subjectsTaught,
                topicsTaught: selectedTopics,
            });
    
            // Save token to local storage
            const token = await user.getIdToken();
            localStorage.setItem('accessToken', token);
    
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error("Error during signup:", err);
            setErrors([err.message]);
            setIsLoading(false);
        }
    }

  const nextPage = (e) => {
    e.preventDefault();

    let validationErrors = [];

    // Check if email is valid
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
        validationErrors.push("Invalid email address.");
    }

    // Check if passwords match
    if (password !== passwordConfirmation) {
        validationErrors.push("Passwords do not match.");
    }

    // If there are any validation errors, set them to state
    if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
    }

    // Clear errors and navigate to next page
    setErrors([]);
    setStep(prev => prev + 1)
    };

    const prevPage = () => setStep(prev => prev - 1);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in");
        } else {
            console.log("User is not logged in");
        }
    });

    return () => unsubscribe();
}, []);
  return(
    <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
        
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-green-600">
            {showLogin ? 
            "Log In":
            "Create an Account"}
        </h2>
        
        {showLogin ? 
        <div className="mt-5 border-4 border-green-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
            <div className="h-12 pointer-events-none mt-2 text-md font-medium leading-6">
                <input 
                    className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                /> 
                <label 
                    htmlFor="email" 
                    className={`block text-green-700 relative ${email.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}
                >
                    Email address
                </label>
            </div>
        </div>


            <div>
        <div className="h-12 pointer-events-none mt-2 text-md font-medium leading-6">
            <input 
                className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                onChange={(e) => setPassword(e.target.value)} 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="password" 
                required 
            /> 
            <label 
                htmlFor="password" 
                className={`block text-green-700 relative ${password.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}
            >
                Password
            </label>
        </div>
    </div>
            <div className="flex w-full justify-center items-center flex-wrap">
                {errors.map((err, index) => (
                    <div key={index} className="text-red-600 py-4">{err}</div>
                ))}
            </div>
            <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">{isLoading? "Loading..." : "Sign in"}</button>
            </div>
            </form>
            <p className="mt-10 text-center text-sm text-green-500">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}}className="font-semibold leading-6 text-green-600 hover:text-green-500"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}} className="font-semibold leading-6 text-green-600 hover:text-green-500"> Sign in here.</a>
                </>}

            </p>

        </div>:
        <div className="">
        {step === 1 && (

                        
        
        <div className="mt-5 border-4 border-green-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
            <form className="space-y-6 ">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`h-12 pointer-events-none ${fName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md font-medium leading-6`}>
                        <input 
                            className=" bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setFName(e.target.value)} 
                            id="fName" 
                            name="fName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="fName" className={`block text-green-700 relative ${fName.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>First Name</label>
                    </div>
                    <div className={`h-12 pointer-events-none ${lName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md font-medium leading-6`}>
                        <input 
                            className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setLName(e.target.value)} 
                            id="lName" 
                            name="lName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="lName"  className={`block text-green-700 relative ${lName.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Last Name</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${email.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                        <input className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                                onChange={(e)=>setEmail(e.target.value)} id="email" name="email" type="email" autocomplete="email" required /> 
                        <label for="email"  className={`block text-green-700 relative ${email.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Email address</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${password.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                    <input className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPassword(e.target.value)} id="password" name="password" type="password" autocomplete="password" required /> 
                    <label for="password"  className={`block text-green-700 relative ${password.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Password</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${passwordConfirmation.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                    <input className="bg-green-100 peer pointer-events-auto block w-full py-1.5 font-normal text-green-900 border-b-2 border-0 border-green-500 focus:border-green-900 focus:ring-0 placeholder:text-green-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPasswordConfirmation(e.target.value)} id="passwordConfirmation" name="passwordConfirmation" type="password" autocomplete="passwordConfirmation" required /> 
                    <label for="passwordConfirmation"  className={`block text-green-700 relative ${passwordConfirmation.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Confirm Password</label>  
                    </div>
                </div>

                <div className="flex w-full justify-center items-center flex-wrap">
                    {errors.map((err, index) => (
                        <div key={index} className="text-red-600 py-4">{err}<span> </span></div>
                    ))}
                </div>
                <div>
                    <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Next</button>
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-green-500">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>setShowLogin(!showLogin)}className="font-semibold leading-6 text-green-600 hover:text-green-500"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>setShowLogin(!showLogin)} className="font-semibold leading-6 text-green-600 hover:text-green-500"> Sign in here.</a>
                </>}

            </p>
        </div>
        )}

        {step === 2 && (
            <div className="mt-5 border-4 border-green-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
                <form className="space-y-6">
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
                        <h1 className="col-span-1 font-semibold text-green-800">Hours Available: </h1>
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

                    <div className="flex w-full justify-center items-center">
                        {errors.map((err) => (
                            <div key={err} className="text-red-600 py-4">{err}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                            Back
                        </button>
                        <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                            Next
                        </button>
                    </div>
                </form>
            </div>

        )}

        {step === 3 && (
            <div className="mt-5 border-4 border-green-600 p-8 rounded-xl shadow-lg lg:w-6/12 md:7/12 w-11/12 mx-auto text-center">
                <form className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 underline">Confirm Information</h2>
                    <p className="font-bold text-lg">Name: <span className="font-medium">{fName} {lName}</span></p>
                    <p className="font-bold text-lg">Email: <span className="font-medium">{email}</span></p>
                    <p className="font-bold text-lg">Work Location: <span className="font-medium">{workLocation}</span></p>
                    <p className="font-bold text-lg">Subjects Taught: <span className="font-medium">{subjectsTaught.join(', ')}</span></p>
                    <div className="font-bold text-lg mt-2">Topics:</div>
                    <ul className="font-medium text-gray-700 list-disc list-inside pl-5">
                        {subjectsTaught.map(subject => (
                            <li key={subject} className="text-left">
                                <span className="font-bold">{subject}:</span> {selectedTopics.filter(topic => subjectMapping[subject].includes(topic)).join(', ')}
                            </li>
                        ))}
                    </ul>
                    <p className="font-bold text-lg mt-2">Languages Spoken: <span className="font-medium">{languagesSpoken.join(', ')}</span></p>
                    <p className="font-bold text-lg mt-2">Hours Worked:</p>
                    <pre className="font-medium text-gray-700 rounded-md p-2">{displaySelectedCells(selectedCells)}</pre>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Back</button>
                        <button onClick={(e)=>handleSignup(e)} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Submit</button>
                    </div>
                </form>
                <div className="flex w-full justify-center items-center flex-wrap mt-4">
                    {errors.map((err, index) => (
                        <div key={index} className="text-red-600 py-2 px-3 bg-red-100 rounded-md">{err}</div>
                    ))}
                </div>
            </div>
        )}
    </div>
        }



    </div>
</div>
  )
}

export default Login;
