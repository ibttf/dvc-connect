import React from "react";

export default function LoginStep3({
  fName,
  lName,
  email,
  workLocation,
  subjectsTaught,
  languagesSpoken,
  selectedCells,
  prevPage,
  errors,
  handleSignup,
  isSubmitLoading,
  displaySelectedCells,
}) {
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
        <p className="font-normal md:text-md text-xs">
          Work Location: <span className="font-bold">{workLocation}</span>
        </p>
        <p className="font-normal md:text-md text-xs">
          Subjects Taught:{" "}
          <span className="font-bold">{subjectsTaught.join(", ")}</span>
        </p>
        <p className="font-normal md:text-md text-xs mt-2">
          Languages Spoken:{" "}
          <span className="font-bold">{languagesSpoken.join(", ")}</span>
        </p>
        <div className="flex w-full justify-center">
          <p className="font-normal md:text-md text-xs">Hours Worked:</p>
          <pre className="font-bold font-sans md:text-md text-xs">
            {displaySelectedCells(selectedCells)}
          </pre>
        </div>
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
      <div className="flex w-full justify-center items-center flex-wrap mt-4">
        {errors.map((err, index) => (
          <div
            key={index}
            className="text-red-600 py-2 px-3 bg-red-100 rounded-md"
          >
            {err}
          </div>
        ))}
      </div>
    </div>
  );
}
