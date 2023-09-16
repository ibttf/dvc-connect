import React, { useState, useEffect, useRef } from "react";
import {db, auth} from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";


function AdminLogin(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("mathlab@email.com");
  const [workLocation,setWorkLocation]=useState("")
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading]=useState(false);
  
  const [errors,setErrors]=useState([])

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            console.log(email,password)
            const userCredential = await signInWithEmailAndPassword(auth,  email, password)
                .then(userCredential => {
                    console.log('User Credential:', userCredential);
                    localStorage.setItem('accessToken', userCredential.user.accessToken);
                    navigate("/");
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Login error:", err);
                    setErrors(["Invalid password"]);
                    setIsLoading(false);
                });
            console.log('User Credential:', userCredential);
            localStorage.setItem('accessToken', userCredential.user.accessToken);
            navigate("/")
        } catch (err) {
            console.error("Login error:", err);
            setErrors(["Invalid password"]);
        } finally {
            setIsLoading(false);
        }
    };

    
 
  return(
    <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-xl shadow-xl">
        
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900 w-fit mx-auto md:px-4 px-2 capitalize border-b-4 border-indigo-500">
            Admin Log in
        </h2>
        
        {
        <div className="mt-5 p-8 rounded-xl md:w-8/12 w-full md:px-0 px-2 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="items-center w-full">
                    <div className="relative">
                        <select 
                            className="md:text-md text-xs block appearance-none w-full bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        >
                            <option className="" value="mathlab@email.com">Math and Engineering Center</option>
                            <option className="" value="mesa@email.com">Math and Engineering Student Achievement Center</option>
                            <option className="" value="disabilitysupportservices@admin.com">Disability Support Services</option>
                            <option className="" value="academicsupportcenter@admin.com">Academic Support Services</option>
                            <option className="" value="physics@admin.com">Physics Lab</option>
                            <option className="" value="english@admin.com">English Lab</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-1.414-1.414a.999.999 0 0 0-1.414 0L10 10.586 7.121 7.707a.999.999 0 0 0-1.414 0L4.293 9.293a.999.999 0 0 0 0 1.414z"/>
                            </svg>
                        </div>
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
                <button 
                    type="submit" 
                    className="flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isLoading ? "Loading..." : "Sign in"}
                </button>
            </div>
            </form>

        </div>
        
        }
    </div>
</div>
  )
}
export default AdminLogin;
