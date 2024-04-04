import React, { useState, useEffect, useRef } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { AiOutlineLeft } from "react-icons/ai";
export default function TutorEditProfile({}) {
  const { tid } = useParams();
  const navigate = useNavigate();
  //state variables we're grabbing from firebase
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workSchedule, setWorkSchedule] = useState({});
  const [selectedCells, setSelectedCells] = useState(
    workSchedule[location] ? workSchedule[location].schedule : []
  );
  const [languagesSpoken, setLanguagesSpoken] = useState(
    workSchedule[location] ? workSchedule[location].languages : []
  );
  const [subjectsTaught, setSubjectsTaught] = useState(
    workSchedule[location] ? workSchedule[location].subjects : []
  );

  // state variables for interactivity

  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] =
    useState(false);

  const [isWorkScheduleInitialized, setIsWorkScheduleInitialized] =
    useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        const adminDocRef = doc(db, "admins", uid);
        const adminDocSnapshot = await getDoc(adminDocRef);

        if (adminDocSnapshot.exists()) {
          setLocation(adminDocSnapshot.data().location);
        }
        const userDocRef = doc(db, "users", tid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          setFName(userSnapshot.data().fName);
          setLName(userSnapshot.data().lName);
          if (!isWorkScheduleInitialized) {
            setWorkSchedule(userSnapshot.data().schedule);
            setIsWorkScheduleInitialized(true);
          }
          setSelectedCells(
            workSchedule[location] ? workSchedule[location].schedule : []
          );
          setLanguagesSpoken(
            workSchedule[location] ? workSchedule[location].languages : []
          );
          setSubjectsTaught(
            workSchedule[location] ? workSchedule[location].subjects : []
          );
        } else {
          console.log("No such user!");
        }
      } else {
        console.log("No user is signed in");
      }
    });

    return unsubscribe;
  }, [isWorkScheduleInitialized]);

  const isDragging = useRef(false);

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

  async function handleEditProfile(e) {
    e.preventDefault();
    setIsLoading(true);
    const newSchedule = { ...workSchedule };
    newSchedule[location] = {
      languages: languagesSpoken,
      subjects: subjectsTaught,
      schedule: selectedCells,
    };

    setWorkSchedule(newSchedule);

    const userDocRef = doc(db, "users", tid);

    await updateDoc(userDocRef, {
      fName: fName,
      lName: lName,
      email: email,
      schedule: newSchedule,
    });

    setIsLoading(false);
    window.location.reload();
  }

  return (
    <div className="mt-5  p-8 rounded-xl md:w-9/12 w-full md:px-0 px-2 mx-auto">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <h2
            onClick={() => navigate("/")}
            className="md:text-md text-xs sm:mb-0 mb-4 flex justify-left items-center w- full text-gray-500 hover:text-black cursor-pointer"
          >
            <AiOutlineLeft className="mr-3 md:text-md text-sm" />
            {"    "}
            Back to All Tutors
          </h2>
          <h1 className="font-bold text-center md:text-xl xs:text-lg text-sm  mb-4 text-gray-900">
            {fName} {lName}'s Schedule at <br></br>
            <span className="text-indigo-400">{location}</span>
          </h1>

          <form className="space-y-6">
            <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
              <h1 className="col-span-1 font-semibold text-indigo-800 md:text-md text-xxs">
                There, they teach:{" "}
              </h1>
              <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                {[
                  "Accounting",
                  "Administration Justice",
                  "Anthropology",
                  "Biology",
                  "Business",
                  "Chemistry",
                  "Communication",
                  "Computer Science",
                  "Early Childhood Education",
                  "Economics",
                  "Engineering",
                  "English",
                  "Ethnic Studies",
                  "History",
                  "Math",
                  "Political Science",
                  "Psychology",
                  "Sociology",
                  "Spanish",
                  "Statistics",
                  "Oceanography",
                  "Physics",
                  "Drama",
                  "French",
                  "Humanities",
                  "Japanese",
                  "Music",
                  "Philosophy",
                  "Russian",
                  "Kinesiology",
                  "Nutrition",
                  "Social Justice",
                ].map((subject) => (
                  <label
                    key={subject}
                    className="md:text-md text-xs inline-flex items-center m-1 border-2"
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
              <h1 className="col-span-1 font-semibold text-indigo-800 md:text-md text-xxs">
                On top of English, they can speak:{" "}
              </h1>
              <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
                {["Chinese", "Korean", "Spanish"].map((language) => (
                  <label
                    key={language}
                    className="md:text-md text-xs inline-flex items-center m-1 border-2"
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
              <h1 className="col-span-1 font-semibold text-indigo-800 md:text-md text-xxs">
                Hours Available:{" "}
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
                      <div className="md:text-md text-xxs font-semibold text-gray-600">
                        {timeLabel}
                      </div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday"].map(
                        (day) => (
                          <div
                            key={day}
                            className={`w-10 h-10 border rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
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

            <div className="flex w-full justify-center items-center">
              {errors.map((err) => (
                <div key={err} className="text-red-600">
                  {err}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* END OF COMPONENT */}

        <div className="w-full md:gap-0 ">
          <button
            type="button"
            onClick={handleEditProfile}
            className="md:text-md text-xxs flex w-full mx-auto justify-center rounded-lg bg-indigo-400 md:px-3 md:py-3 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {isLoading ? "Loading" : "Submit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
