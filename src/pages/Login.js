import React, { useState, useEffect, useRef } from "react";
import {db, auth} from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";


function Login(props) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [fName,setFName]=useState("")
  const [lName,setLName]=useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isSubmitLoading,setIsSubmitLoading]=useState(false);



  const [workLocation, setWorkLocation] = useState('Math Lab');
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const[subjectsTaught,setSubjectsTaught]=useState([])


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
        setIsSubmitLoading(true);
    
        if (password !== passwordConfirmation) {
            setErrors(["Password does not match"]);
            setIsSubmitLoading(false);
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
            });
    
            // Save token to local storage
            const token = await user.getIdToken();
            localStorage.setItem('accessToken', token);
    
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error("Error during signup:", err);
            setErrors([err.message]);
            setIsSubmitLoading(false);
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
 if(!props.auth){
    
 }
  return(
    <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-4xl mainShadow">
        
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900">
            {showLogin ? 
            "Log In":
            "Create an Account"}
        </h2>
        
        {showLogin ? 
        <div className="mt-5 p-8 rounded-xl md:w-8/12 w-full md:px-0 px-2 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
            <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
                <input 
                    className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email" 
                    name="email" 
                    type="" 
                    autoComplete="email" 
                     
                /> 
                <label 
                    htmlFor="email" 
                    className={`block text-gray-700 relative ${email.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}
                >
                    Email address
                </label>
            </div>
        </div>


            <div>
        <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
            <input 
                className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(e) => setPassword(e.target.value)} 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="password" 
                required 
            /> 
            <label 
                htmlFor="password" 
                className={`block text-gray-700 relative ${password.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}
            >
                Password
            </label>
        </div>
    </div>
            <div className="flex w-full justify-center items-center flex-wrap">
                {errors.map((err, index) => (
                    <div key={index} className="text-red-600">{err}</div>
                ))}
            </div>
            <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">{isLoading? "Loading..." : "Sign in"}</button>
            </div>
            </form>
            <p className="mt-10 text-center md:text-sm text-xs">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}}className="font-semibold leading-6 text-gray-900 hover:text-gray-500 duration-100"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}} className="font-semibold leading-6 text-gray-900 hover:text-gray-500 duration-100"> Sign in here.</a>
                </>}

            </p>
            <h3 onClick={()=>navigate("/admin-login")}className="text-center cursor-pointer text-sm text-gray-400 hover:text-gray-900">
            Admin?
        </h3>

        </div>:
        <div className="">
            <ol class="flex items-center  md:w-4/12 w-9/12 mx-auto md:my-4 my-2">
                <li class={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${step == 1 ? "after:border-green-25" : "after:border-gray-100"}  after:border-4 after:inline-block`}>
                    <span class={`flex items-center justify-center w-10 h-10 ${step == 1 ? "bg-green-25 opacity-90" : "bg-gray-100"}  rounded-full lg:h-12 lg:w-12 shrink-0`}>
                        <svg class={`w-3.5 h-3.5 ${step == 1 ? "text-gray-900" : "text-gray-500"} lg:w-4 lg:h-4 `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                    </span>
                </li>
                <li class={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${step == 2 ? "after:border-green-25" : "after:border-gray-100"} after:border-4 after:inline-block`}>
                    <span class={`flex items-center justify-center w-10 h-10 ${step == 2 ? "bg-green-25 opacity-90" : "bg-gray-100"}  rounded-full lg:h-12 lg:w-12 shrink-0`}>
                        <svg class={`w-4 h-4 ${step == 2 ? "text-green-500" : "text-gray-500"} lg:w-5 lg:h-5 `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
                        </svg>
                    </span>
                </li>
                <li class="flex items-center w-fit">
                    <span className={`flex items-center justify-center w-10 h-10 ${step == 3 ? "bg-green-25 opacity-90" : "bg-gray-100"}  rounded-full lg:h-12 lg:w-12 shrink-0`}>
                        <svg class={`w-4 h-4 ${step == 3 ? "text-green-500" : "text-gray-500"} lg:w-5 lg:h-5 `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
                        </svg>
                    </span>
                </li>
            </ol>
        {step === 1 && (

                        
        
        <div className="mt-5  p-8 rounded-xl md:w-6/12 w-full md:px-0 px-2 mx-auto">

            <form className="space-y-6 ">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`h-12 pointer-events-none ${fName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md  leading-6`}>
                        <input 
                            className="  peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setFName(e.target.value)} 
                            id="fName" 
                            name="fName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="fName" className={`block text-gray-700 relative ${fName.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}>First Name</label>
                    </div>
                    <div className={`h-12 pointer-events-none ${lName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md  leading-6`}>
                        <input 
                            className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setLName(e.target.value)} 
                            id="lName" 
                            name="lName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="lName"  className={`block text-gray-700 relative ${lName.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}>Last Name</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${email.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md  leading-6`}>
                        <input className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                onChange={(e)=>setEmail(e.target.value)} id="email" name="email" type="email" autocomplete="email" required /> 
                        <label for="email"  className={`block text-gray-700 relative ${email.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}>Email address</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${password.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md  leading-6`}>
                    <input className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPassword(e.target.value)} id="password" name="password" type="password" autocomplete="password" required /> 
                    <label for="password"  className={`block text-gray-700 relative ${password.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}>Password</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${passwordConfirmation.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md  leading-6`}>
                    <input className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPasswordConfirmation(e.target.value)} id="passwordConfirmation" name="passwordConfirmation" type="password" autocomplete="passwordConfirmation" required /> 
                    <label for="passwordConfirmation"  className={`block text-gray-700 relative ${passwordConfirmation.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}>Confirm Password</label>  
                    </div>
                </div>

                <div className="flex w-full justify-center items-center flex-wrap">
                    {errors.map((err, index) => (
                        <div key={index} className="text-red-600">{err}<span> </span></div>
                    ))}
                </div>
                <div>
                    <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Next</button>
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>{setShowLogin(!showLogin); setErrors([])}}className="font-semibold leading-6 text-gray-900 hover:text-gray-500"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>{setShowLogin(!showLogin); setErrors([])}} className="font-semibold leading-6 text-gray-900 hover:text-gray-500"> Sign in here.</a>
                </>}

            </p>
            <h3 onClick={()=>navigate("/admin-login")}className="text-center cursor-pointer text-sm text-gray-400 hover:text-gray-900">
                Admin?
            </h3>
        </div>
        )}

        {step === 2 && (
            <div className="mt-5 md:border-4 border-2 border-green-600 p-8 rounded-xl w-full mx-auto">
                <form className="space-y-6">
                <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                    <h1 className="col-span-1 font-semibold text-green-800 md:text-md text-xxs">I work in the: </h1>
                    <div className="relative md:col-span-3 col-span-5">
                        <select 
                            className="md:text-md text-xs block appearance-none w-full bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                        >
                            <option className="" value="Math Lab">Math Lab</option>
                            <option className="" value="English Lab">English Lab</option>
                            <option className="" value="Reading Lab">Reading Lab</option>
                            <option className="" value="Science Lab">Science Lab</option>
                            <option className="" value="Social Studies Lab">Social Studies Lab</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-1.414-1.414a.999.999 0 0 0-1.414 0L10 10.586 7.121 7.707a.999.999 0 0 0-1.414 0L4.293 9.293a.999.999 0 0 0 0 1.414z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                    <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="col-span-1 font-semibold text-green-800 md:text-md text-xxs">There, I teach: </h1>
                        <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                            {["Math", "English", "Science"].map(subject => (
                                <label key={subject} className="md:text-md text-xs inline-flex items-center m-1 ">
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
                        <h1 className="col-span-1 font-semibold text-green-800 md:text-md text-xxs">On top of English, I can speak: </h1>
                        <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                            {["Chinese", "Korean", "Spanish"].map(language => (
                                <label key={language} className="md:text-md text-xs inline-flex items-center m-1 ">
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
                        <h1 className="col-span-1 font-semibold text-green-800 md:text-md text-xxs">Hours Available: </h1>
                        <div className="grid grid-cols-5 gap-4 mt-4 md:col-span-3 col-span-5 lg:text-md text-xs" onMouseUp={handleMouseUp}>
                            <div></div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                <div key={day} className="md:text-md text-xxs text-center font-semibold text-gray-700">
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
                                        <div className="md:text-md text-xxs font-semibold text-gray-600">{timeLabel}</div>
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
                            <div key={err} className="text-red-600">{err}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                            Back
                        </button>
                        <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                            Next
                        </button>
                    </div>
                </form>
            </div>

        )}

        {step === 3 && (
            <div className="mt-5 md:border-4 border-2 border-green-600 p-8 rounded-xl shadow-lg w-full mx-auto text-center">
                <form className="space-y-6">
                    <h2 className="md:text-xl text-md font-normal mb-4 underline">Confirm Information</h2>
                    <p className="font-normal md:text-md text-xs">Name: <span className="font-bold">{fName} {lName}</span></p>
                    <p className="font-normal md:text-md text-xs">Email: <span className="font-bold">{email}</span></p>
                    <p className="font-normal md:text-md text-xs">Work Location: <span className="font-bold">{workLocation}</span></p>
                    <p className="font-normal md:text-md text-xs">Subjects Taught: <span className="font-bold">{subjectsTaught.join(', ')}</span></p>
                    <p className="font-normal md:text-md text-xs mt-2">Languages Spoken: <span className="font-bold">{languagesSpoken.join(', ')}</span></p>
                    <div className="flex w-full justify-center">
                        <p className="font-normal md:text-md text-xs mt-2">Hours Worked:</p>
                        <pre className="font-bold font-sans md:text-md text-xs">{displaySelectedCells(selectedCells)}</pre>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Back</button>
                        <button onClick={(e)=>handleSignup(e)} className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">{isSubmitLoading ? "Loading": "Submit"}</button>
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
