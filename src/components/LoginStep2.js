import React from "react";

export default function LoginStep2({
  workLocation,
  setWorkLocation,
  subjectsTaught,
  languagesSpoken,
  selectedCells,
  nextPage,
  prevPage,
  errors,
  handleSubjectsTaughtChange,
  handleLanguageChange,
  handleMouseUp,
  handleMouseDown,
  handleMouseEnter,
}) {
  const handleWorkLocationChange = (e) => {
    const location = e.target.value;
    if (workLocation.includes(location)) {
      setWorkLocation(workLocation.filter((loc) => loc !== location));
    } else {
      setWorkLocation([...workLocation, location]);
    }
  };
  return (
    <div className="mt-5 md:border-4 border-2 border-indigo-600 p-8 rounded-xl w-full mx-auto">
      <form className="space-y-6">
        <div className="grid md:grid-cols-4 grid-cols-6 items-center gap-4 w-full">
          <h1 className="col-span-1 font-semibold text-indigo-800 md:text-md text-xxs">
            I work in the:{" "}
          </h1>
          <div className="flex flex-wrap md:col-span-3 col-span-5 items-center">
            {[
              "Academic Support Center - Pleasant Hill",
              "Academic Support Center - San Ramon",
              "Arts, Communication, and Language Student Center",
              "Business, Computer Science, and Culinary Center",
              "DSS/EOPS Program",
              "Math and Engineering Student Center",
              "Science and Health Student Center",
              "Social Science Health Center",
            ].map((location) => (
              <label
                key={location}
                className="md:text-md text-xs inline-flex items-center m-1 border-2"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  value={location}
                  checked={workLocation.includes(location)}
                  onChange={handleWorkLocationChange}
                />
                <span
                  className={`cursor-pointer p-2 rounded transition-colors duration-300 
                                        ${
                                          workLocation.includes(location)
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white hover:bg-gray-100 text-gray-800"
                                        }
                                    `}
                >
                  {location}
                </span>
              </label>
            ))}
          </div>
        </div>

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
                  {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
                    <div
                      key={day}
                      className={`w-10 h-10 border rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                        selectedCells[`${day}-${timeLabel}`]
                          ? "bg-indigo-400"
                          : "bg-white hover:bg-gray-100"
                      }`}
                      onMouseDown={() => handleMouseDown(timeLabel, day)}
                      onMouseEnter={() => handleMouseEnter(timeLabel, day)}
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

        <div className="grid grid-cols-2 gap-2">
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
      </form>
    </div>
  );
}
