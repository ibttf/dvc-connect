import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
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

          // Set results
          setResults(matchingDocs);
          

      } catch (error) {
          console.error('Error querying Firestore:', error);
      }
  };

  fetchData();
}, [props.language, day, hours, subject, topic]);

return(
<div className="pb-24 bg-green-100">

<h1 className="mx-auto md:w-fit w-11/12 lg:text-3xl text-xs  font-semibold text-green-800 mt-12 leading-tight">
  Looking for 
  <span className='font-medium text-green-600'> {subject} </span>
  tutors for
  <span className='font-medium text-green-600'> {topic} </span>
  that speak
  <span className='font-medium text-green-600'> {capitalizeFirstLetter(props.language)} </span>
  on 
  <span className='font-medium text-green-600'> {capitalizeFirstLetter(day)}s </span>
  at 
  <span className='font-medium text-green-600'> {formatHours(hours)} </span>
</h1>

<div className="lg:w-6/12 w-11/12 mx-auto my-6 bg-green-800 bg-opacity-50 rounded-lg shadow-lg">

  <div className="py-4 text-center text-xl">

    {/* RESULTS */}
    <div className="space-y-4">
      <ul>
      {results.map((result) => {
        console.log(result);
        const id = result.id;  // instead of result.id
        const data = result.data();  // instead of result.data
        return(
          <li key={id} className="border-b md:p-4 p-2 w-10/12 mx-auto grid grid-cols-5 items-center justify-center gap-2 rounded-md hover:bg-green-200 transition-all cursor-pointer">
            <AiOutlineUser
                className="md:w-12 md:h-12 w-6 h-6 mx-auto mb-4 col-span-1 text-gray-600"
            />
            <div className="col-span-3 grid grid-cols-1 grid-rows-2 gap-2 text-center">
              <h2 className="md:text-lg text-sm font-medium text-gray-800">{data.fName} {data.lName}</h2>
              <p className="text-gray-600 md:text-sm text-xs">{data.workLocation}</p>
            </div>
          </li>
        )}
      )}
      </ul>
    </div>
  </div>
</div>
</div>

)
}

export default Tutors;
