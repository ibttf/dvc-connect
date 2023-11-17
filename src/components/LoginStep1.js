import React, { useEffect } from "react";

export default function LoginStep1({
  fName,
  setFName,
  lName,
  setLName,
  email,
  setEmail,
  emailError,
  setEmailError,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  errors,
  setErrors,
  showLogin,
  setShowLogin,
  nextPage,
}) {
  useEffect(() => {
    if (!email.endsWith("@4cd.insite.edu")) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [email, setEmailError]);
  return (
    <div className="mt-5  p-8 rounded-xl md:w-6/12 w-full md:px-0 px-2 mx-auto">
      <form className="space-y-6 ">
        <div className="grid grid-cols-2 gap-4">
          {/* First Name Input */}
          <div>
            <div
              className={`h-12 pointer-events-none ${
                fName.length > 0 ? "text-xs" : "focus-within:text-xs"
              } mt-2 text-md leading-6`}
            >
              <input
                className="peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(e) => setFName(e.target.value)}
                id="fName"
                name="fName"
                type="text"
                required
              />
              <label
                htmlFor="fName"
                className={`block text-gray-700 relative ${
                  fName.length > 0
                    ? "-top-14 text-xs"
                    : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                } duration-300`}
              >
                First Name
              </label>
            </div>
          </div>

          {/* Last Name Input */}
          <div>
            <div
              className={`h-12 pointer-events-none ${
                lName.length > 0 ? "text-xs" : "focus-within:text-xs"
              } mt-2 text-md leading-6`}
            >
              <input
                className="peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(e) => setLName(e.target.value)}
                id="lName"
                name="lName"
                type="text"
                required
              />
              <label
                htmlFor="lName"
                className={`block text-gray-700 relative ${
                  lName.length > 0
                    ? "-top-14 text-xs"
                    : "peer-focus:-top-14 peer-focus:text-xs -top-7"
                } duration-300`}
              >
                Last Name
              </label>
            </div>
          </div>
        </div>

        {/* Email Input */}
        <div>
          <div
            className={`h-12 pointer-events-none mt-2 text-md leading-6 border-gray-500`}
          >
            <input
              className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-900 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <label
              htmlFor="email"
              className={`block text-gray-700 relative ${
                email.length > 0
                  ? "-top-14 text-xs"
                  : "peer-focus:-top-14 peer-focus:text-xs -top-7"
              } duration-300`}
            >
              Email address
            </label>
          </div>
          {email.length > 0 && emailError && (
            <div className="text-red-600 mt-2">
              Email does not end in @4cd.insite.edu
            </div>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div
            className={`h-12 pointer-events-none mt-2 text-md leading-6 border-gray-900`}
          >
            <input
              className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-900 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
            />
            <label
              htmlFor="password"
              className={`block text-gray-700 relative ${
                password.length > 0
                  ? "-top-14 text-xs"
                  : "peer-focus:-top-14 peer-focus:text-xs -top-7"
              } duration-300`}
            >
              Password
            </label>
          </div>
          {password.length > 0 && (
            <ul className={` mt-2`}>
              <li
                className={`${
                  password.length >= 6 ? "text-green-600" : "text-red-600"
                }`}
              >
                {password.length >= 6 ? "✓" : "✗"} At least 6 characters long
              </li>
              <li
                className={`${
                  /[A-Z]/.test(password) ? "text-green-600" : "text-red-600"
                }`}
              >
                {/[A-Z]/.test(password) ? "✓" : "✗"} Contains at least one
                uppercase letter
              </li>
            </ul>
          )}
        </div>

        {/* Password Confirmation Input */}
        <div>
          <div
            className={`h-12 pointer-events-none mt-2 text-md leading-6 ${
              passwordConfirmation.length > 0
                ? "border-red-500"
                : "border-gray-500"
            }`}
          >
            <input
              className={`peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-900 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="passwordConfirmation"
              required
            />
            <label
              htmlFor="passwordConfirmation"
              className={`block text-gray-700 relative ${
                passwordConfirmation.length > 0
                  ? "-top-14 text-xs"
                  : "peer-focus:-top-14 peer-focus:text-xs -top-7"
              } duration-300`}
            >
              Confirm Password
            </label>
          </div>
          {passwordConfirmation.length > 0 &&
            password !== passwordConfirmation && (
              <div className="text-red-600 mt-2">Passwords do not match</div>
            )}
        </div>

        <div className="grid grid-cols-1 text-center w-full justify-center items-center ">
          {errors.map((err, index) => (
            <div key={index} className="text-red-600">
              {err}
            </div>
          ))}
        </div>
      </form>
      <p className="mt-10 text-center text-sm text-gray-500">
        {showLogin ? (
          <>
            Don't have an account?
            <button
              onClick={() => {
                setShowLogin(!showLogin);
                setErrors([]);
              }}
              className="font-semibold leading-6 ml-1 text-gray-900 hover:text-gray-500"
            >
              {" "}
              Sign up here.
            </button>
          </>
        ) : (
          <div className="mb-8">
            Already have an account?
            <button
              onClick={() => {
                setShowLogin(!showLogin);
                setFName("");
                setLName("");
                setEmail("");
                setPassword("");
                setErrors([]);
              }}
              className="font-semibold leading-6 ml-1 text-gray-900 hover:text-gray-500"
            >
              {" "}
              Sign in here.
            </button>
          </div>
        )}
      </p>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={nextPage}
          className="flex w-full justify-center rounded-md bg-gray-900 opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
