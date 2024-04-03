import React, { Fragment, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineBank } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import LocationModal from "./LocationModal";
export default function LoginStep2Pre({
  centers,
  workSchedule,
  setWorkSchedule,
  nextPage,
  prevPage,
  errors,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isLocationDropdownVisible, setIsLocationDropdownVisible] =
    useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="mt-5  p-8 rounded-xl md:w-9/12 w-full md:px-0 px-2 mx-auto">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-white rounded-lg shadow-lg border p-4">
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
        <div className="grid grid-cols-2 space-x-4">
          <button
            onClick={prevPage}
            className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back
          </button>
          <button
            onClick={nextPage}
            className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Next
          </button>
        </div>
      </div>
      {isOpen && (
        <LocationModal
          isOpen={isOpen}
          currentLocation={selectedLocation}
          closeModal={closeModal}
          workSchedule={workSchedule}
          setWorkSchedule={setWorkSchedule}
          centers={centers}
          nextPage={nextPage}
          prevPage={prevPage}
          errors={errors}
        />
      )}
    </div>
  );
}
