import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import { AiTwotoneHome } from "react-icons/ai";
import { collection, query, getDocs, where, doc } from "firebase/firestore";

const Tutors = (props) => {
  // Extract route parameters using useParams
  let { day, hours, subject } = useParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function formatHours(h) {
    if (h === "Any Time") {
      return props.t("Any Time");
    }
    const formattedHours = `${h.substring(0, 2)}:${h.substring(2, 4)}`;
    return ["09", "10", "11"].includes(h.substring(0, 2))
      ? `${formattedHours} AM`
      : `${formattedHours} PM`;
  }

  function parseHoursToTimeSlots(hours) {
    const hourString = hours.toString().padStart(4, "0");
    const hourPart = parseInt(hourString.substring(0, 2), 10);

    // Determine AM or PM
    let period = hourPart < 12 ? "AM" : "PM";

    // Convert 24-hour format to 12-hour format
    let formattedHour = hourPart;
    if (hourPart > 12) {
      formattedHour -= 12;
    } else if (hourPart === 0) {
      // handle midnight
      formattedHour = 12;
    }

    const minutesPart = hourString.substring(2, 4);

    return `${formattedHour}:${minutesPart}${period}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let timeSlot = parseHoursToTimeSlots(hours);

        let formattedLanguage = capitalizeFirstLetter(props.language);
        let formattedSubject = capitalizeFirstLetter(subject);

        const formattedDay = capitalizeFirstLetter(day);

        // Fetch documents based on the language

        let usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userDocs = userSnapshot.docs;

        const matchingLocations = [];
        console.log(formattedLanguage, formattedDay, timeSlot);
        userDocs.forEach((doc) => {
          const data = doc.data();
          Object.keys(data.schedule).forEach((location) => {
            const locationData = data.schedule[location];
            if (
              locationData.languages.includes(formattedLanguage) ||
              formattedLanguage == "English"
            ) {
              if (
                locationData.subjects.includes(formattedSubject) ||
                formattedSubject == "Any Subject"
              ) {
                if (
                  Object.keys(locationData.schedule).some((key) =>
                    key.startsWith(formattedDay)
                  ) ||
                  formattedDay == "Any Day"
                ) {
                  if (
                    Object.keys(locationData.schedule).some((key) =>
                      key.includes(timeSlot)
                    ) ||
                    hours == "Any Time"
                  ) {
                    matchingLocations.push(location);
                  }
                }
              }
            }
          });
        });

        // Collect unique workLocations
        const uniqueWorkLocations = Array.from(new Set(matchingLocations));

        // Set results
        setResults(uniqueWorkLocations);
      } catch (error) {
        console.error("Error querying Firestore:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="pb-24">
      <div className="lg:w-6/12 w-11/12 mx-auto my-10">
        <div className="text-center text-xl space-y-6">
          <h1 className="md:text-2xl text-lg font-medium text-gray-800">
            {props.t("Locations with")}
            <span className="font-semibold t``ext-gray-900">
              {" "}
              {props.t(subject)}{" "}
            </span>
            {props.t("tutors")} {props.t("who speak")}
            <span className="font-semibold text-gray-900">
              {" "}
              {props.t(capitalizeFirstLetter(props.language))}{" "}
            </span>
            {props.t("on")}
            <span className="font-semibold text-gray-900">
              {" "}
              {props.t(capitalizeFirstLetter(day))}{" "}
            </span>
            {props.t("at")}
            <span className="font-semibold text-gray-900">
              {" "}
              {formatHours(hours)}{" "}
            </span>
          </h1>

          <div className="mt-4 bg-white rounded-lg shadow-md">
            <ul role="list" className="divide-y divide-gray-200  mx-auto">
              {results.length > 0 ? (
                results.map((workLocation, index) => (
                  <li key={index} className="flex items-center py-3 px-6">
                    <AiTwotoneHome className="w-5 h-5" />
                    <a
                      href="https://www.dvc.edu/about/campuses/maps.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" ml-4 md:text-lg text-md text-gray-700 hover:text-indigo-600"
                    >
                      {props.t(workLocation)
                        ? props.t(workLocation)
                        : workLocation}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-lg text-gray-700 text-left py-3 px-3">
                  {props.t("No locations available")}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutors;
