import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef } from "react";

export default function LocationModal({
  isOpen,
  closeModal,

  workSchedule,
  currentLocation,
  setWorkSchedule,
  errors,
}) {
  const [selectedCells, setSelectedCells] = useState(
    workSchedule[currentLocation] ? workSchedule[currentLocation].schedule : []
  );
  const [languagesSpoken, setLanguagesSpoken] = useState(
    workSchedule[currentLocation] ? workSchedule[currentLocation].languages : []
  );
  const [subjectsTaught, setSubjectsTaught] = useState(
    workSchedule[currentLocation] ? workSchedule[currentLocation].subjects : []
  );
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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto max-w-6xl mx-auto bg-opacity-40">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="mt-5 md:border-4 border-2  bg-white  border-indigo-600 p-8 rounded-xl w-full mx-auto">
                  <h1 className="pb-5 md:pb-10 font-semibold text-indigo-800 md:text-2xl text-md">
                    {currentLocation}
                  </h1>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-4 grid-cols-6 grid-rows-1 items-center gap-4 w-full">
                      <h1 className="col-span-1 font-semibold text-indigo-800 md:text-md text-xxs">
                        There, I teach:{" "}
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
                            className="md:text-md text-xs  inline-flex items-center m-1 border-2"
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
                        On top of English, I can speak:{" "}
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
                        {["Monday", "Tuesday", "Wednesday", "Thursday"].map(
                          (day) => (
                            <div
                              key={day}
                              className="md:text-md text-xxs text-center font-semibold text-gray-700"
                            >
                              {day}
                            </div>
                          )
                        )}

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
                              {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                              ].map((day) => (
                                <div
                                  key={day}
                                  className={`w-10 h-10 border rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                                    selectedCells[`${day}-${timeLabel}`]
                                      ? "bg-indigo-400"
                                      : "bg-white hover:bg-gray-100"
                                  }`}
                                  onMouseDown={() =>
                                    handleMouseDown(timeLabel, day)
                                  }
                                  onMouseEnter={() =>
                                    handleMouseEnter(timeLabel, day)
                                  }
                                ></div>
                              ))}
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

                    <div className="grid grid-cols-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setWorkSchedule((prevSchedule) => {
                            const newSchedule = { ...prevSchedule };
                            newSchedule[currentLocation] = {
                              languages: languagesSpoken,
                              subjects: subjectsTaught,
                              schedule: selectedCells,
                            };
                            return newSchedule;
                          });
                          closeModal();
                        }}
                        className="flex w-fit mx-auto justify-center rounded-md bg-gray-900 opacity-90 px-3 py-2 md:py-5 text-xs md:text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
