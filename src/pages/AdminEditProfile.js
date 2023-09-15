import React, { useState, useEffect, useRef } from "react";
import { getFirestore, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { signOut, updateEmail  } from "firebase/auth";

function EditProfile(props) {

    const navigate=useNavigate();
    const [email,setEmail]=useState("")
    const [location, setLocation] = useState('');
    const [isLoading,setIsLoading]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);
    const [showModal, setShowModal] = useState(false);





    async function handleEditProfile(e) {
        e.preventDefault();
        setIsLoading(true);
    
        const user = auth.currentUser;  // Get the current authenticated user
        if (!user) {
            console.error("No user is signed in");
            return;
        }
    
        const userDocRef = doc(db, 'admins', user.uid);
    
        await updateDoc(userDocRef, {
            email: email,
            location: location
        });
        await updateEmail(user, email)
    
        // Save token to local storage
        const token = await user.getIdToken();
        localStorage.setItem('accessToken', token);
        setIsLoading(false);
        // navigate("/");
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
                const userDocRef = doc(db, 'admins', uid);
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
                const userDocRef = doc(db, 'admins', uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    setLocation(userSnapshot.data().location)
                    setEmail(userSnapshot.data().email)
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
   
    <div className="bg-white shadow-3xl mb-12 md:mt-5 mt-2 md:p-8 p-3 rounded-4xl lg:w-6/12 md:7/12 w-10/12 mx-auto ">
        <h1 className="font-semibold text-center md:text-lg xs:text-lg text-sm uppercased mb-4 text-gray-900">
            {location} Administrator
        </h1>
        <h2 className="font-semibold text-center md:text-md xs:text-lg text-sm uppercase md:mb-4 mb-2 text-gray-600">
            Manage Location
        </h2>
        <form className="space-y-6">
            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
                <h1 className="lg:text-lg md:text-md text-xxs col-span-1 font-semibold text-green-800">Email: </h1>
                <input className="border rounded mt-2 p-2 w-full md:col-span-3 col-span-5 md:text-md text-xxs" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
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
