import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
export default function LoginStep3({
  fName,
  lName,
  email,
  workSchedule,
  centers,
  password,
  passwordConfirmation,
  prevPage,
  handleSignup,
  displaySelectedCells,
}) {
  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errors, setErrors] = useState([]);
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        fName: fName,
        lName: lName,
        schedule: workSchedule,
      });
      // Add user to the admins document
      await Promise.all(
        Object.keys(workSchedule).map(async (location) => {
          if (centers[location] !== null) {
            const adminId = centers[location];
            const adminDocRef = doc(db, "admins", adminId);
            return updateDoc(adminDocRef, {
              tutorIds: arrayUnion(user.uid),
            });
          }
        })
      );

      // Save token to local storage
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Error during signup:", err);
      setErrors([err.message]);
      setIsSubmitLoading(false);
    }
  }
  return (
    <div className="mt-5 md:border-4 border-2 border-indigo-600 p-8 rounded-xl shadow-lg w-full mx-auto text-center">
      <form className="space-y-6">
        <h2 className="md:text-xl text-md font-normal mb-4 underline decoration-blue-500">
          Confirm Information
        </h2>
        <p className="font-normal md:text-md text-xs">
          Name:{" "}
          <span className="font-bold">
            {fName} {lName}
          </span>
        </p>
        <p className="font-normal md:text-md text-xs">
          Email: <span className="font-bold">{email}</span>
        </p>
        <p className="font-bold md:text-md text-xs">Work Schedule: </p>
        {Object.entries(workSchedule).map(([location, details], index) => {
          const languages = details.languages.join(", ");

          return (
            <>
              <p
                key={location}
                className=" md:text-md text-xs font-bold text-left w-full mx-auto"
              >
                <span className="font-bold">{location}</span>
                <br />
                <span className="font-bold">Additional Languages:</span>{" "}
                <span className="font-normal">{languages}</span>
                <br />
                <span className="font-bold">Hours Worked:</span>{" "}
                <span className="font-normal">
                  {displaySelectedCells(details.schedule)}
                </span>
              </p>
              <hr />
            </>
          );
        })}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={prevPage}
            className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back
          </button>
          <button
            onClick={(e) => handleSignup(e)}
            className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitLoading ? "Loading" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
