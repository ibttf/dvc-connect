import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';


const Tutors = (props) => {
  // Extract route parameters using useParams
  let { day, hours } = useParams();
  let language=props.language;
  const [mainLanguage, setMainLanguage] = useState('english');
  const [results, setResults] = useState([]);


  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
          // Parse the hour input into a time slot
          const timeSlot = parseHoursToTimeSlots(hours);
          
          // Convert the language and day parameter's first character to uppercase and the rest to lowercase
          let formattedLanguage = capitalizeFirstLetter(language);
          if (formattedLanguage === "English") {
              formattedLanguage = "";
          }
          const formattedDay = capitalizeFirstLetter(day);

          // Set the initial query to users collection
          let q = query(collection(db, 'users'));

          // Modify the query based on the language only if it's not English
          if (formattedLanguage !== "") {
              q = query(collection(db, 'users'), where('languagesSpoken', 'array-contains', formattedLanguage));
          }

          const querySnapshot = await getDocs(q);

          // Filter the fetched tutors based on availability
          const matchingDocs = querySnapshot.docs
                .filter(doc => {
                  const data = doc.data();
                  const keyExists = `${formattedDay}-${timeSlot}` in data.selectedCells;
                  console.log(`Key ${formattedDay}-${timeSlot} exists:`, keyExists);
              
                  if (keyExists) {
                      return data.selectedCells[`${formattedDay}-${timeSlot}`];
                  }
                  return false;
              })
              .map(doc => ({
                  id: doc.id,
                  data: doc.data(),
              }));

          setResults(matchingDocs);
      } catch (error) {
          console.error('Error querying Firestore:', error);
      }
  };

  fetchData();
}, [language]);


    return(
      <div className="pb-24 bg-blue-200">
        <div className="w-10/12 mx-auto my-12">

          <div className=" border-2 border-black rounded-b-md py-6 text-center text-xl">
            <h1>
                Looking for tutors that speak
                <span className='font-semibold text-2xl'> {language[0].toUpperCase()}{language.substring(1)} </span>
                 on 
                <span className='font-semibold text-2xl'> {day[0].toUpperCase()}{day.substring(1)} </span>
                at 
                <span className='font-semibold text-2xl'> {hours.substring(0,2)}:{hours.substring(2,4)}{["09","10","11"].includes(hours.substring(0,2)) ? "AM": "PM" }  </span>
            </h1>
         {/* RESULTS */}
         <div>

      <ul className="mx-64">
      {results.map((result) => 
        {
          const { id, data } = result; // Destructuring if you have both id and data in your result.
          return(
          <div key={id} className="border p-4 shadow-sm w-full grid grid-cols-5 items-center justify-center my-2">
              <AiOutlineUser
                  className="rounded-full w-16 h-16 mx-auto mb-4 col-span-1 text-gray-700"
              />
              <div className="col-span-3 grid grid-cols-1 grid-rows-2 gap-2 text-center">
                <h2 className="text-xl font-semibold text-gray-700">{data.fName} {data.lName}</h2>
                <p className="text-gray-500 text-md">{data.workLocation}</p>
              
              </div>
          </div>
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
