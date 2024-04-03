import React, { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import AuthLocationModal from "../components/AuthLocationModal";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineBank } from "react-icons/ai";
export default function TutorEditProfile({}) {
  const centers = {
    "Academic Support Center - Pleasant Hill": "4acM6zLf3DdL3saL1EZS7Yt8HS02",
    "Academic Support Center - San Ramon": "fAQVaeQ883OU9gD4HMYw3py15CT2",
    "Arts, Communication, and Language Student Center":
      "DOpiKtcPRuXg9DufqWFcjyHdKvv2",
    a: "2L1vchFOiPYFJaB4E9r9YZWNvZ82",
    "Math and Engineering Student Center": "aGdIjNimQ8cNkWRnE1RluTIuWOs1",
    "Science and Health Student Center": "ih7BKlRlPzc6hJ8D2Xs1fNitYPI3",
    " Health Center": "ZrxjwiWtF0bYKBjpB9DP4CQjIBG2",
    "Disability and Support Services/EOPS": "jRmyzCabqIWe6u8JHduVzoYDSQE2",
  };

  //state variables we're grabbing from firebase
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // state variables for interactivity
  const [workSchedule, setWorkSchedule] = useState({});
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] =
    useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getFirestore();
        const uid = user.uid; // Get UID from auth token
        const userDocRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          setWorkSchedule(userSnapshot.data().schedule);
          setEmail(userSnapshot.data().email);
          setFName(userSnapshot.data().fName);
          setLName(userSnapshot.data().lName);
        }
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  async function handleEditProfile(e) {
    e.preventDefault();
    setIsLoading(true);
    const user = auth.currentUser; // Get the current authenticated user

    if (!user) {
      console.error("No user is signed in");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    await updateDoc(userDocRef, {
      fName: fName,
      lName: lName,
      email: email,
      schedule: workSchedule,
    });
    // Add user to the admins document
    Object.keys(workSchedule).forEach((location) => {
      if (centers[location] !== null) {
        const adminId = centers[location];
        console.log(location, centers[location], adminId, user.uid);
        const adminDocRef = doc(db, "admins", adminId);
        updateDoc(adminDocRef, {
          tutorIds: arrayUnion(user.uid),
        });
      }
    });
    // Save token to local storage
    const token = await user.getIdToken();
    localStorage.setItem("accessToken", token);
    setIsLoading(false);
    navigate("/");
  }

  const confirmDelete = async (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);

    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        // Assuming your Firestore collection where you store user info is 'users'
        const userDocRef = doc(db, "users", uid);
        console.log(userDocRef);
        await deleteDoc(userDocRef);

        await signOut(auth);
      }
    } catch (error) {
      console.error("Error deleting user's information: ", error);
    } finally {
      setIsDeleteLoading(false);
      setShowModal(false);
    }
  };
  return (
    <div className="mt-5  p-8 rounded-xl md:w-9/12 w-full md:px-0 px-2 mx-auto">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <h1 className="font-bold text-center md:text-xl xs:text-lg text-sm uppercased mb-4 text-gray-900">
            HI, {fName.toUpperCase()} {lName.toUpperCase()}
          </h1>
          <h2 className="flex flex-col items-center justify-center font-semibold text-center md:text-lg text-sm uppercase mb-4 text-gray-700 border-b pb-2">
            MANAGE WORK SCHEDULES
            <span className="md:text-xs text-xxs font-light my-2 capitalize">
              Click to edit
            </span>
          </h2>

          <ul className="space-y-4 mt-4">
            {Object.keys(workSchedule).map((location) => {
              return (
                <li
                  key={location}
                  className="p-3 bg-gray-50 border rounded-lg cursor-pointer hover:bg-indigo-300 hover:shadow-md focus:bg-indigo-400 focus:outline-none transition-all duration-200 flex items-center justify-between"
                  onClick={() => {
                    setSelectedLocation(location);

                    setIsOpen(true);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <AiOutlineBank className="h-8 w-8 text-gray-100 p-1 bg-indigo-400 rounded-full" />
                    <span className="text-gray-700 font-medium md:text-md text-xs">
                      {location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AiOutlineDelete
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkSchedule((prevSchedule) => {
                          const newSchedule = { ...prevSchedule };
                          delete newSchedule[location];
                          return newSchedule;
                        });
                      }}
                      className="text-red-500 hover:text-red-600 cursor-pointer ml-1"
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="relative flex flex-col items-center justify-center w-full">
            {[
              "Academic Support Center - Pleasant Hill",
              "Academic Support Center - San Ramon",
              "Arts, Communication, and Language Student Center",
              "Business, Computer Science, and Culinary Center",
              "DSS/EOPS Program",
              "Math and Engineering Student Center",
              "Science and Health Student Center",
              "Social Science Health Center",
            ].filter(
              (location) => !Object.keys(workSchedule).includes(location)
            ).length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLocationDropdownVisible(!isLocationDropdownVisible);
                }}
                title="Add location"
                className="peer mt-4 flex items-center justify-center w-12 h-12 bg-indigo-400 border-2 border-indigo-400 text-white rounded-full hover:bg-white hover:text-indigo-400 hover:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-200 transition-all duration-200"
              >
                <AiOutlinePlus className="text-xl" />
              </button>
            ) : (
              <></>
            )}

            {isLocationDropdownVisible && (
              <div className=" left-0 mt-2 w-64 shadow-lg bg-white border border-gray-300 rounded z-10">
                {[
                  "Academic Support Center - Pleasant Hill",
                  "Academic Support Center - San Ramon",
                  "Arts, Communication, and Language Student Center",
                  "Business, Computer Science, and Culinary Center",
                  "DSS/EOPS Program",
                  "Math and Engineering Student Center",
                  "Science and Health Student Center",
                  "Social Science Health Center",
                ]
                  .filter(
                    (location) => !Object.keys(workSchedule).includes(location)
                  )
                  .map((location) => (
                    <button
                      key={location}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onClick={() => {
                        setWorkSchedule({
                          ...workSchedule,
                          [location]: {
                            subjects: [],
                            schedule: {},
                            languages: [],
                          },
                        });
                        setIsLocationDropdownVisible(false);
                      }}
                    >
                      {location}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:gap-0 ">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="md:text-md text-xxs flex md:w-10/12 w-10/12 mx-auto justify-center rounded-lg bg-red-600 md:px-3 md:py-2 font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isDeleteLoading ? "Loading" : "Delete Account"}
          </button>
          <button
            type="button"
            onClick={handleEditProfile}
            className="md:text-md text-xxs flex md:w-10/12 w-10/12 mx-auto justify-center rounded-lg bg-blue-600 md:px-3 md:py-2 font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isLoading ? "Loading" : "Submit Changes"}
          </button>
        </div>
        {showModal && (
          <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-2xl transform transition-transform duration-300">
              <h2 className="text-2xl font-semibold mb-2">Are you sure?</h2>
              <p className="text-gray-600 mb-4">
                Do you really want to delete your account? This action cannot be
                undone.
              </p>
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
      </div>
      {isOpen && (
        <AuthLocationModal
          isOpen={isOpen}
          currentLocation={selectedLocation}
          closeModal={closeModal}
          workSchedule={workSchedule}
          setWorkSchedule={setWorkSchedule}
          centers={centers}
          errors={errors}
        />
      )}
    </div>
  );
}
