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

    const handleLanguageChange = (event) => {
        const { value, checked } = event.target;

        if (checked && !languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => [...prevLanguages, value]);
        } else if (!checked && languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => prevLanguages.filter(lang => lang !== value));
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
                selectedCells: selectedCells
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
        
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-blue-600">
            {showLogin ? 
            "Log In":
            "Create an Account"}
        </h2>
        
        {showLogin ? 
        <div className="mt-5 border-4 border-blue-600 p-8 rounded-xl lg:w-4/12 md:7/12 w-10/12 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
            <div className="h-12 pointer-events-none mt-2 text-md font-medium leading-6">
                <input 
                    className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                /> 
                <label 
                    htmlFor="email" 
                    className={`block text-gray-700 relative ${email.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}
                >
                    Email address
                </label>
            </div>
        </div>


            <div>
        <div className="h-12 pointer-events-none mt-2 text-md font-medium leading-6">
            <input 
                className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(e) => setPassword(e.target.value)} 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="password" 
                required 
            /> 
            <label 
                htmlFor="password" 
                className={`block text-gray-700 relative ${password.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}
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
                <button type="submit" className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">{isLoading? "Loading..." : "Sign in"}</button>
            </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}}className="font-semibold leading-6 text-gray-600 hover:text-gray-500"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>{setErrors([])
                                                setShowLogin(!showLogin)}} className="font-semibold leading-6 text-gray-600 hover:text-gray-500"> Sign in here.</a>
                </>}

            </p>

        </div>:
        <div className="">
        {step === 1 && (

                        
        
        <div className="mt-5 border-4 border-blue-600 p-8 rounded-xl lg:w-4/12 md:7/12 w-10/12 mx-auto">
            <form className="space-y-6 ">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`h-12 pointer-events-none ${fName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md font-medium leading-6`}>
                        <input 
                            className=" bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setFName(e.target.value)} 
                            id="fName" 
                            name="fName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="fName" className={`block text-gray-700 relative ${fName.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>First Name</label>
                    </div>
                    <div className={`h-12 pointer-events-none ${lName.length > 0 ? "text-xs" : "focus-within:text-xs"} mt-2 text-md font-medium leading-6`}>
                        <input 
                            className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e) => setLName(e.target.value)} 
                            id="lName" 
                            name="lName" 
                            type="text" 
                            required
                        /> 
                        <label htmlFor="lName"  className={`block text-gray-700 relative ${lName.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Last Name</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${email.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                        <input className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                onChange={(e)=>setEmail(e.target.value)} id="email" name="email" type="email" autocomplete="email" required /> 
                        <label for="email"  className={`block text-gray-700 relative ${email.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Email address</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${password.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                    <input className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPassword(e.target.value)} id="password" name="password" type="password" autocomplete="password" required /> 
                    <label for="password"  className={`block text-gray-700 relative ${password.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Password</label>  
                    </div>
                </div>
                <div>
                    <div className={`h-12 pointer-events-none ${passwordConfirmation.length>1 ? "text-xs" : "focus-within:text-xs"}  mt-2  text-md font-medium leading-6`}>
                    <input className="bg-blue-200 peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            onChange={(e)=>setPasswordConfirmation(e.target.value)} id="passwordConfirmation" name="passwordConfirmation" type="password" autocomplete="passwordConfirmation" required /> 
                    <label for="passwordConfirmation"  className={`block text-gray-700 relative ${passwordConfirmation.length > 0 ? "-top-12 text-xs" : "peer-focus:-top-12 peer-focus:text-xs -top-7"} duration-300`}>Confirm Password</label>  
                    </div>
                </div>

                <div className="flex w-full justify-center items-center flex-wrap">
                    {errors.map((err, index) => (
                        <div key={index} className="text-red-600 py-4">{err}<span> </span></div>
                    ))}
                </div>
                <div>
                    <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Next</button>
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
                {showLogin?
                <>
                    Don't have an account? 
                    <a href="#" onClick={()=>setShowLogin(!showLogin)}className="font-semibold leading-6 text-gray-600 hover:text-gray-500"> Sign up here.</a>
                </>:
                <>
                    Already have an account? 
                    <a href="#" onClick={()=>setShowLogin(!showLogin)} className="font-semibold leading-6 text-gray-600 hover:text-gray-500"> Sign in here.</a>
                </>}

            </p>
        </div>
        )}

        {step === 2 && (
            <div className="mt-5 border-4 border-blue-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
                <form className="space-y-6">
                    <div className="grid grid-cols-4 items-center gap-4 w-full">
                        <h1 className="col-span-1">I work in the: </h1>
                        <select 
                            className="border rounded mt-2 p-2 w-full col-span-3"
                            value={workLocation}
                            onChange={(e)=>setWorkLocation(e.target.value)}
                        >
                            <option value="Math Lab">Math Lab</option>
                            <option value="English Lab">English Lab</option>
                            <option value="Reading Lab">Reading Lab</option>
                            <option value="Science Lab">Science Lab</option>
                            <option value="Social Studies Lab">Social Studies Lab</option>
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-4 grid-rows-1 items-center gap-4 w-full">
                        <h1 className="col-span-1">I speak: </h1>
                            <div className="flex mt-2 space-x-2 col-span-3">
                                <label className="inline-flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox" 
                                        value="Chinese"
                                        checked={languagesSpoken.includes('Chinese')}
                                        onChange={handleLanguageChange}
                                    />
                                    <span className="ml-2">Chinese</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox" 
                                        value="Korean"
                                        checked={languagesSpoken.includes('Korean')}
                                        onChange={handleLanguageChange}
                                    />
                                    <span className="ml-2">Korean</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox" 
                                        value="Spanish"
                                        checked={languagesSpoken.includes('Spanish')}
                                        onChange={handleLanguageChange}
                                    />
                                    <span className="ml-2">Spanish</span>
                                </label>
                            </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4 w-full">
                        <h1 className="col-span-1">Hours Available: </h1>



                        <div className="grid grid-cols-5 gap-2 mt-2 col-span-3" onMouseUp={handleMouseUp}>
                            <div></div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                <div key={day} className="text-center font-semibold">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: 16 }, (_, i) => {
                                // Adjusted logic for non-military time
                                let hour = 9 + Math.floor(i / 2);
                                const period = hour >= 12 ? "PM" : "AM";
                                if (hour > 12) hour -= 12;  // Convert to 12-hour format
                                const minute = i % 2 === 0 ? "00" : "30";
                                const timeLabel = `${hour}:${minute}${period}`;

                                return (
                                    <React.Fragment key={timeLabel}>
                                        <div className="font-semibold">{timeLabel}</div>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                            <div 
                                                key={day} 
                                                className={`w-10 h-10 border rounded-full cursor-pointer ${selectedCells[`${day}-${timeLabel}`] ? 'bg-gray-400' : ''}`}
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
                        <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                            Back
                        </button>
                        <button onClick={nextPage} className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                            Next
                        </button>
                    </div>
                </form>
            </div>

        )}

        {step === 3 && (
        <div className="mt-5 border-4 border-blue-600 p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto text-center">
            <form className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Confirm Information</h2>
                <p className="font-bold">Name: <span className="font-normal">{fName} {lName}</span></p>
                <p className="font-bold">Email: <span className="font-normal">{email}</span></p>
                <p className="font-bold">Work Location: <span className="font-normal">{workLocation}</span></p>
                <p className="font-bold">Languages Spoken: <span className="font-normal">{languagesSpoken.join(', ')}</span></p>
                <p className="font-bold">Hours Worked: <pre className="font-normal">{displaySelectedCells(selectedCells)}</pre></p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={prevPage} className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Back</button>
                    <button onClick={(e)=>handleSignup(e)} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Submit</button>
                </div>
            </form>
            <div className="flex w-full justify-center items-center flex-wrap">
                {errors.map((err, index) => (
                    <div key={index} className="text-red-600 py-4">{err}</div>
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
