import React, { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    "academicsupportcenterpleasanthill@email.com"
  );
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then((userCredential) => {
          console.log("User Credential:", userCredential);
          localStorage.setItem("accessToken", userCredential.user.accessToken);
          navigate("/");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Login error:", err);
          setErrors(["Invalid password"]);
          setIsLoading(false);
        });
      console.log("User Credential:", userCredential);
      localStorage.setItem("accessToken", userCredential.user.accessToken);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrors(["Invalid password"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-white md:w-6/12 w-11/12 mx-auto my-12 md:mb-48 rounded-xl shadow-xl">
        <h2 className="text-center md:text-2xl text-md font-bold leading-9 tracking-tight text-gray-900 w-fit mx-auto md:px-4 px-2 capitalize border-b-4 border-indigo-500">
          Admin Log in
        </h2>

        {
          <div className="mt-5 p-8 rounded-xl md:w-8/12 w-full md:px-0 px-2 mx-auto">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="items-center w-full">
                <div className="relative">
                  <select
                    className="md:text-md text-xs block appearance-none w-full bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  >
                    <option
                      className=""
                      value="academicsupportcenterpleasanthill@email.com"
                    >
                      Academic Support Center - Pleasant Hill
                    </option>
                    <option
                      className=""
                      value="academicsupportcentersanramon@email.com"
                    >
                      Academic Support Center - San Ramon
                    </option>
                    <option
                      className=""
                      value="artscommunicationanlanguagestudentcenter@email.com"
                    >
                      Arts, Communication, and Language Student Center
                    </option>
                    <option
                      className=""
                      value="businesscomputerscienceandculinarycenter@email.com"
                    >
                      Business, Computer Science, and Culinary Center
                    </option>
                    <option className="" value="dsseops@email.com">
                      Disability and Support Services/EOPS
                    </option>
                    <option
                      className=""
                      value="mathandengineeringstudentcenter@email.com"
                    >
                      Math and Engineering Student Center
                    </option>
                    <option
                      className=""
                      value="scienceandhealthstudentcenter@email.com"
                    >
                      Science and Health Student Center
                    </option>
                    <option
                      className=""
                      value="socialsciencehealthcenter@email.com"
                    >
                      Social Science Health Center
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 9.293L10 14l4.707-4.707a.999.999 0 0 0 0-1.414l-1.414-1.414a.999.999 0 0 0-1.414 0L10 10.586 7.121 7.707a.999.999 0 0 0-1.414 0L4.293 9.293a.999.999 0 0 0 0 1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="h-12 pointer-events-none mt-2 text-md  leading-6">
                  <input
                    className=" peer pointer-events-auto block w-full py-1.5 font-normal text-gray-900 border-b-2 border-0 border-gray-500 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
              </div>
              <div className="flex w-full justify-center items-center flex-wrap">
                {errors.map((err, index) => (
                  <div key={index} className="text-red-600">
                    {err}
                  </div>
                ))}
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-700  opacity-90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-100"
                >
                  {isLoading ? "Loading..." : "Sign in"}
                </button>
              </div>
              <h3
                onClick={() => navigate("/login")}
                className="text-center cursor-pointer text-sm text-gray-400 hover:text-gray-700 mt-3"
              >
                Tutor?
              </h3>
            </form>
          </div>
        }
      </div>
    </div>
  );
}
export default AdminLogin;
