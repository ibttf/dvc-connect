import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AdminCreateTutor(props) {
  const navigate = useNavigate();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [subjectsTaught, setSubjectsTaught] = useState([]);

  const [emailError, setEmailError] = useState(false);

  // Checking the email format
  useEffect(() => {
    if (!email.endsWith("@4cd.insite.edu")) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [email]);

  const handleLanguageChange = (event) => {
    const { value, checked } = event.target;

    if (checked && !languagesSpoken.includes(value)) {
      setLanguagesSpoken((prevLanguages) => [...prevLanguages, value]);
    } else if (!checked && languagesSpoken.includes(value)) {
      setLanguagesSpoken((prevLanguages) =>
        prevLanguages.filter((lang) => lang !== value)
      );
    }
  };

  const handleSubjectsTaughtChange = (event) => {
    const { value, checked } = event.target;

    if (checked && !subjectsTaught.includes(value)) {
      setSubjectsTaught((prevSubjectsTaught) => [...prevSubjectsTaught, value]);
    } else if (!checked && subjectsTaught.includes(value)) {
      setSubjectsTaught((prevSubjectsTaught) =>
        prevSubjectsTaught.filter((subj) => subj !== value)
      );
    }
  };

  const [errors, setErrors] = useState([]);
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
    setSelectedCells((prev) => {
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

  async function createNewTutor(e) {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      // Create user with email and password
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add a new document to the 'users' collection with the generated ID
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        fName: fName,
        lName: lName,
        workLocation: props.location,
        languagesSpoken: languagesSpoken,
        selectedCells: selectedCells,
        subjectsTaught: subjectsTaught,
      });

      // Update the admin's list of tutor IDs
      const adminRef = doc(db, "admins", props.adminUID);

      // Get the current tutorIds from the admin document
      const adminDoc = await getDoc(adminRef);
      let currentTutorIds = adminDoc.data().tutorIds || [];

      if (!currentTutorIds.includes(user.uid)) {
        currentTutorIds.push(user.uid);
        await updateDoc(adminRef, { tutorIds: currentTutorIds });
      }

      navigate("/");
    } catch (err) {
      console.error("Error during signup:", err);
      setErrors([err.message]);
      setIsSubmitLoading(false);
    }
  }
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
  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-xl shadow-xl">
        <h3
          className="text-gray-400 md:text-xs text-xxs hover:text-gray-800 cursor-pointer md:pl-4 pl-6"
          onClick={() => navigate("/")}
        >
          &lt; Back to Tutors
        </h3>
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900 md:-mt-2">
          Add a Tutor
        </h2>
        <h3 className="text-center text-gray-500 md:text-sm text-xs my-3">
          For the {props.location}
        </h3>

        <div className="mt-5 px-8 w-full md:px-0 mx-auto">
          <form className="space-y-6 ">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Input */}
              <div>
                <div
                  className={`h-12 pointer-events-none ${
                    fName.length > 0 ? "text-xs" : "focus-within:text-xs"
                  } mt-2 text-md leading-6`}
                >
                  <input
                    className="peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setFName(e.target.value)}
                    id="fName"
                    name="fName"
                    type="text"
                    required
                  />
                  <label
                    htmlFor="fName"
                    className={`block text-gray-700 relative ${
                      fName.length > 0
                        ? "-top-14 text-xs"
                        : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                    } duration-300`}
                  >
                    First Name
                  </label>
                </div>
              </div>

              {/* Last Name Input */}
              <div>
                <div
                  className={`h-12 pointer-events-none ${
                    lName.length > 0 ? "text-xs" : "focus-within:text-xs"
                  } mt-2 text-md leading-6`}
                >
                  <input
                    className="peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={(e) => setLName(e.target.value)}
                    id="lName"
                    name="lName"
                    type="text"
                    required
                  />
                  <label
                    htmlFor="lName"
                    className={`block text-gray-700 relative ${
                      lName.length > 0
                        ? "-top-14 text-xs"
                        : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                    } duration-300`}
                  >
                    Last Name
                  </label>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div
                className={`h-12 pointer-events-none mt-2 text-md leading-6 ${
                  email.length > 0 && emailError
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              >
                <input
                  className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 ${
                    email.length > 0
                      ? emailError
                        ? "border-red-500"
                        : "border-gray-900"
                      : "border-gray-500"
                  } focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <label
                  htmlFor="email"
                  className={`block text-gray-700 relative ${
                    email.length > 0
                      ? "-top-14 text-xs"
                      : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                  } duration-300`}
                >
                  Email address
                </label>
              </div>
              {email.length > 0 && emailError && (
                <div className="text-red-600 mt-2">
                  Email does not end in @4cd.insite.edu
                </div>
              )}
              {/* Password Input */}
              <div>
                <div
                  className={`h-12 pointer-events-none mt-6 text-md leading-6 border-gray-900`}
                >
                  <input
                    className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                  />
                  <label
                    htmlFor="password"
                    className={`block text-gray-700 relative ${
                      password?.length > 0
                        ? "-top-14 text-xs"
                        : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                    } duration-300`}
                  >
                    Password
                  </label>
                </div>
                {password?.length > 0 && (
                  <ul className={` mt-2`}>
                    <li
                      className={`${
                        password?.length >= 6
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {password?.length >= 6 ? "✓" : "✗"} At least 6 characters
                      long
                    </li>
                    <li
                      className={`${
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {/[A-Z]/.test(password) ? "✓" : "✗"} Contains at least one
                      uppercase letter
                    </li>
                  </ul>
                )}
              </div>

              {/* Password Confirmation Input */}
              <div>
                <div
                  className={`h-12 pointer-events-none mt-8 text-md leading-6 ${
                    passwordConfirmation?.length > 0
                      ? "border-red-500"
                      : "border-gray-500"
                  }`}
                >
                  <input
                    className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    autoComplete="passwordConfirmation"
                    required
                  />
                  <label
                    htmlFor="passwordConfirmation"
                    className={`block text-gray-700 relative ${
                      passwordConfirmation?.length > 0
                        ? "-top-14 text-xs"
                        : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                    } duration-300`}
                  >
                    Confirm Password
                  </label>
                </div>
                {console.log(password, passwordConfirmation)}
                {passwordConfirmation?.length > 0 &&
                  password !== passwordConfirmation && (
                    <div className="text-red-600 mt-2">
                      Passwords do not match
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-1 text-center w-full justify-center items-center ">
                {errors.map((err, index) => (
                  <div key={index} className="text-red-600">
                    {err}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full justify-center items-center flex-wrap">
              {errors.map((err, index) => (
                <div key={index} className="text-red-600">
                  {err}
                  <span> </span>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* STEP 2 EQUIVALENT */}
        <div className="mt-5 px-8 w-full mx-auto">
          <form className="space-y-6">
            <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
              <h1 className="col-span-1 font-semibold text-gray-700 md:text-md text-xxs">
                They teach:{" "}
              </h1>
              <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                {["Math", "English", "Science"].map((subject) => (
                  <label
                    key={subject}
                    className="md:text-md text-xs inline-flex items-center m-1 "
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      value={subject}
                      checked={subjectsTaught.includes(subject)}
                      onChange={handleSubjectsTaughtChange}
                    />
                    <span
                      className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                    ${
                                      subjectsTaught.includes(subject)
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white hover:bg-gray-100 text-gray-800"
                                    }
                                `}
                    >
                      {subject}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
              <h1 className="col-span-1 font-semibold text-gray-700 md:text-md text-xxs">
                They can speak:{" "}
              </h1>
              <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                {["Chinese", "Korean", "Spanish"].map((language) => (
                  <label
                    key={language}
                    className="md:text-md text-xs inline-flex items-center m-1 "
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      value={language}
                      checked={languagesSpoken.includes(language)}
                      onChange={handleLanguageChange}
                    />
                    <span
                      className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                    ${
                                      languagesSpoken.includes(language)
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white hover:bg-gray-100 text-gray-800"
                                    }
                                `}
                    >
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
              <h1 className="col-span-1 font-semibold text-gray-700 md:text-md text-xxs">
                Hours Worked:{" "}
              </h1>
              <div
                className="grid grid-cols-5 gap-4 mt-4 md:col-span-3 col-span-5 lg:text-md text-xs"
                onMouseUp={handleMouseUp}
              >
                <div></div>
                {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
                  <div
                    key={day}
                    className="md:text-md text-xxs text-center font-semibold text-gray-700"
                  >
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
                      <div className="md:text-md text-xxs font-semibold text-gray-600 mb-reduced">
                        {timeLabel}
                      </div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday"].map(
                        (day) => (
                          <div
                            key={day}
                            className={`w-10 h-10 border rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer cell-space ${
                              selectedCells[`${day}-${timeLabel}`]
                                ? "bg-indigo-400"
                                : "bg-white hover:bg-gray-100"
                            }`}
                            onMouseDown={() => handleMouseDown(timeLabel, day)}
                            onMouseEnter={() =>
                              handleMouseEnter(timeLabel, day)
                            }
                          ></div>
                        )
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </form>
        </div>
        <div className="grid mt-8">
          <button
            onClick={(e) => createNewTutor(e)}
            className="flex w-full justify-center rounded-md bg-indigo-600 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitLoading ? "Loading" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateTutor;
