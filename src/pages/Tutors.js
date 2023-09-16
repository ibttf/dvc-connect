import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { collection, getDocs, query, where } from 'firebase/firestore';


const Tutors = (props) => {
  // Extract route parameters using useParams
  let { day, hours, subject, topic } = useParams();

  const [results, setResults] = useState([]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatHours(h) {
    const formattedHours = `${h.substring(0,2)}:${h.substring(2,4)}`;
    return ["09","10","11"].includes(h.substring(0,2)) ? `${formattedHours} AM` : `${formattedHours} PM`;
}

  function parseHoursToTimeSlots(hours) {
    const hourString = hours.toString().padStart(4, '0');
    const hourPart = parseInt(hourString.substring(0, 2), 10);

    // Determine AM or PM
    let period = hourPart < 12 ? "AM" : "PM";

    // Convert 24-hour format to 12-hour format
    let formattedHour = hourPart;
    if (hourPart > 12) {
        formattedHour -= 12;
    } else if (hourPart === 0) {  // handle midnight
        formattedHour = 12;
    }

    const minutesPart = hourString.substring(2, 4);

    return `${formattedHour}:${minutesPart}${period}`;
}



useEffect(() => {
  const fetchData = async () => {
      try {
          const timeSlot = parseHoursToTimeSlots(hours);
          
          let formattedLanguage = capitalizeFirstLetter(props.language);
          let formattedSubject = capitalizeFirstLetter(subject);
          let formattedTopic = topic !== "Any" ? capitalizeFirstLetter(topic) : "any";
          if (formattedLanguage === "English") {
              formattedLanguage = "";
          }
          const formattedDay = capitalizeFirstLetter(day);
          
          // Fetch documents based on the language
          let languageQuery = collection(db, 'users');
          if (formattedLanguage !== "") {
              languageQuery = query(languageQuery, where('languagesSpoken', 'array-contains', formattedLanguage));
          }
          const languageResults = await getDocs(languageQuery);
          const languageDocs = languageResults.docs;


          // Subject Filter
          const subjectResults = languageDocs.filter(doc => {
            const data = doc.data();
            return data && data.subjectsTaught && data.subjectsTaught.includes(formattedSubject);
          });


          // Topic Filter
          let topicResults = [];
          if (formattedTopic !== "any") {
              topicResults = subjectResults.filter(doc => doc.data().topicsTaught.includes(formattedTopic));
          } else {
              topicResults = subjectResults;
          }


          // Availability Filter
          const matchingDocs = topicResults.filter(doc => {
              const data = doc.data();
              const keyExists = `${formattedDay}-${timeSlot}` in data.selectedCells;
              if (keyExists) {
                  return data.selectedCells[`${formattedDay}-${timeSlot}`];
              }
              return false;
          });

           // Collect unique workLocations
            const uniqueWorkLocations = Array.from(new Set(matchingDocs.map(doc => doc.data().workLocation)));

            // Set results
            setResults(uniqueWorkLocations);
          

      } catch (error) {
          console.error('Error querying Firestore:', error);
      }
  };

  fetchData();
}, []);

return(
<div className="pb-24">


<div className="lg:w-8/12 w-11/12 mx-auto my-6 ">

  <div className="py-4 text-center text-xl">

    {/* RESULTS */}
    <div class="w-full mx-auto p-4 bg-white rounded-xl shadow-xl  md:px-12"> 

    <h1 className="mx-auto md:w-fit w-11/12 md:text-lg xs:text-lg xs:text-sm text-xs uppercase text-gray-800 leading-relaxed tracking-tight font-sans">
      {props.t("Locations with")}
      <span className='font-semibold text-indigo-600'> {props.t(subject)} </span>
      {props.t("tutors")}
      {props.t("who speak")}
      <span className='font-semibold text-indigo-600'> {props.t(capitalizeFirstLetter(props.language))} </span>
      {props.t("on")}
      <span className='font-semibold text-indigo-600'> {props.t(capitalizeFirstLetter(day))} </span>
      {props.t("at")}
      <span className='font-semibold text-indigo-600'> {formatHours(hours)} </span>
  </h1>
  <div class="flow-root w-6/12 mx-auto">
        <ul role="list" class="divide-y divide-gray-200">
          {results.length > 0 ? results.map((workLocation, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <a href="https://www.dvc.edu/about/campuses/maps.html" target="_blank" class="text-sm text-gray-500 truncate cursor-pointer">
                    {props.t(workLocation) ? props.t(workLocation) : workLocation}
                  </a>
                </div>
              </div>
            </li>
          )) :
            <h1 className="md:text-md text-xs text-indigo-800 font-semibold my-4">{props.t("No locations available")}</h1>
          }
        </ul>
      </div>
</div>
    <div className="space-y-4">
      <ul>

      </ul>
    </div>
  </div>
</div>
</div>

)
}

export default Tutors;
