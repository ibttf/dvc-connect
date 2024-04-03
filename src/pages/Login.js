import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LoginStep from "../components/LoginStep";
import LoginStep1 from "../components/LoginStep1";
import LoginStep2Pre from "../components/LoginStep2Pre";
import LoginStep2 from "../components/LoginStep2";
import LoginStep3 from "../components/LoginStep3";

function TutorLogin(props) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [workSchedule, setWorkSchedule] = useState({});
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const centers = {
    "Academic Support Center - Pleasant Hill": "4acM6zLf3DdL3saL1EZS7Yt8HS02",
    "Academic Support Center - San Ramon": "fAQVaeQ883OU9gD4HMYw3py15CT2",
    "Arts, Communication, and Language Student Center":
      "DOpiKtcPRuXg9DufqWFcjyHdKvv2",
    "Business, Computer Science, and Culinary Center":
      "2L1vchFOiPYFJaB4E9r9YZWNvZ82",
    "Math and Engineering Student Center": "aGdIjNimQ8cNkWRnE1RluTIuWOs1",
    "Science and Health Student Center": "ih7BKlRlPzc6hJ8D2Xs1fNitYPI3",
    " Health Center": "ZrxjwiWtF0bYKBjpB9DP4CQjIBG2",
    "Disability and Support Services/EOPS": "jRmyzCabqIWe6u8JHduVzoYDSQE2",
  };

  function displaySelectedCells(selectedCells) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday"];

    const groupedSelections = days.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    for (const key in selectedCells) {
      const [day, time] = key.split("-");
      if (groupedSelections[day]) {
        groupedSelections[day].push(time);
      }
    }

    function formatRanges(times) {
      if (times.length === 0) return [];

      // Helper function to convert time to minutes for easier comparison
      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(/[:APM]+/).map(Number);
        return (
          hours * 60 + minutes + (time.includes("PM") && hours !== 12 ? 720 : 0)
        );
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

    return days
      .map((day) => {
        const ranges = formatRanges(groupedSelections[day]);
        if (ranges.length > 0) {
          return `${day}: ${ranges.join(", ")}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Credential:", userCredential);
      localStorage.setItem("accessToken", userCredential.user.accessToken);
      navigate("/");
      setIsLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setErrors(["Invalid username or password."]);
      setIsLoading(false);
    }
  };

  const nextPage = (e) => {
    e.preventDefault();

    let validationErrors = [];

    // Check if email is valid
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      validationErrors.push("Invalid email address.");
    }

    if (password.length === 0) {
      validationErrors.push("Password empty.");
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
    setStep((prev) => prev + 1);
  };

  const prevPage = () => setStep((prev) => prev - 1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in");
      } else {
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe();
  }, [email]);
  if (!props.auth) {
  }
  return (
    <div>
      <div className="flex  flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-xl shadow-xl">
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900 w-fit mx-auto md:px-4 px-2 capitalize border-b-4 border-indigo-500">
          {showLogin ? "Log In" : "Create an Account"}
        </h2>

        {showLogin ? (
          <div className="mt-5 p-8 rounded-xl md:w-8/12 w-full md:px-0 px-2 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
                  <input
                    className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onInput={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type=""
                    defaultValue={email}
                    autoComplete="email"
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
              </div>

              <div>
                <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
                  <input
                    className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onInput={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    defaultValue={password}
                    required
                  />
                  <label
                    htmlFor="password"
                    className={`block text-gray-700 relative ${
                      password.length > 0
                        ? "-top-14 text-xs"
                        : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                    } duration-300`}
                  >
                    Password
                  </label>
                </div>
              </div>
              <div className="flex w-full justify-center items-center flex-wrap">
                {errors.map((err, index) => (
                  <div key={index} className="text-red-600">
                    {err}
                  </div>
                ))}
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? "Loading..." : "Sign in"}
                </button>
              </div>
            </form>
            <p className="mt-10 text-center md:text-sm text-xs">
              {showLogin ? (
                <>
                  Don't have an account?
                  <div
                    onClick={() => {
                      setPassword("");

                      setErrors([]);
                      setShowLogin(!showLogin);
                    }}
                    className="font-semibold leading-6 text-gray-900 hover:text-gray-500 duration-100"
                  >
                    {" "}
                    Sign up here.
                  </div>
                </>
              ) : (
                <>
                  Already have an account?
                  <div
                    onClick={() => {
                      setErrors([]);
                      setShowLogin(!showLogin);
                    }}
                    className="font-semibold leading-6 text-gray-900 hover:text-gray-500 duration-100"
                  >
                    {" "}
                    Sign in here.
                  </div>
                </>
              )}
            </p>
            <h3
              onClick={() => navigate("/admin-login")}
              className="text-center cursor-pointer text-sm text-gray-400 hover:text-gray-700 mt-3 py-3"
            >
              Admin?
            </h3>
          </div>
        ) : (
          <div className="">
            <LoginStep step={step} />
            {step === 1 && (
              <LoginStep1
                emailError={emailError}
                setEmailError={setEmailError}
                fName={fName}
                setFName={setFName}
                lName={lName}
                setLName={setLName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                passwordConfirmation={passwordConfirmation}
                setPasswordConfirmation={setPasswordConfirmation}
                errors={errors}
                setErrors={setErrors}
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                nextPage={nextPage}
              />
            )}

            {step === 2 && (
              <LoginStep2Pre
                centers={centers}
                languagesSpoken={languagesSpoken}
                nextPage={nextPage}
                prevPage={prevPage}
                errors={errors}
                workSchedule={workSchedule}
                setWorkSchedule={setWorkSchedule}
              />
            )}

            {step === 3 && (
              <LoginStep3
                fName={fName}
                lName={lName}
                email={email}
                password={password}
                passwordConfirmation={passwordConfirmation}
                centers={centers}
                workSchedule={workSchedule}
                prevPage={prevPage}
                displaySelectedCells={displaySelectedCells}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorLogin;
