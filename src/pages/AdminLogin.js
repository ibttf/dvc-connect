import React, { useState, useEffect, useRef } from "react";
import {db, auth} from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";


function AdminLogin(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading]=useState(false);
  const [errors,setErrors]=useState([])

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
                    setErrors(["Invalid email or password"]);
                    setIsLoading(false);
                });
            console.log('User Credential:', userCredential);
            localStorage.setItem('accessToken', userCredential.user.accessToken);
            navigate("/")
        } catch (err) {
            console.error("Login error:", err); // It's good to log the error for debugging
            setErrors(["Invalid email or password"]);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleSignup(e) {
        e.preventDefault();
        setIsLoading(true);

    
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Store additional data in Firestore
            // await setDoc(doc(db, 'admins', user.uid), {
            //     location: "Math and Engineering Center",
            //     email: email,
            //     subjects: ["Math","Engineering","Architecture"],
            //     tutorIds:[]
            // });
            // await setDoc(doc(db, 'admins', user.uid), {
            //     location: "Math and Engineering Student Achievement Center",
            //     email: email,
            //     subjects: ["Math","Computer Science","Physics", "Chemistry", "Engineering"],
            //     tutorIds:[]
            // });
            await setDoc(doc(db, 'admins', user.uid), {
                location: "Disability Support Services Tutoring",
                email: email,
                subjects: ["Math","English","Biology", "Chemistry", "Physics", "Business","Accounting"],
                tutorIds:[]
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
 
    
 
  return(
    <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-4xl mainShadow">
        
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900">
            Admin Log in
        </h2>
        
        {
        <div className="mt-5 p-8 rounded-xl md:w-8/12 w-full md:px-0 px-2 mx-auto">
            <form onSubmit={handleSignup} className="space-y-6">
            
            <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
                <input 
                    className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                /> 
                <label 
                    htmlFor="email" 
                    className={`block text-gray-700 relative ${email.length > 0 ? "-top-14 text-xs" : "peer-focus:-top-14 peer-focus:text-xs -top-7"} duration-300`}
                >
                    Email address
                </label>
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

        </div>
        
        }
    </div>
</div>
  )
}
export default AdminLogin;
