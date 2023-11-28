import React, { useState, useEffect } from "react";
import {
  getFirestore,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { db, auth } from "../config/firebase";
import { AiOutlineUser, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
function AdminEditProfile(props) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [tutorsData, setTutorsData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== passwordConfirmation) {
      alert("New password and password confirmation do not match!");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    console.log(currentPassword, newPassword, passwordConfirmation);
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword // Current Password
      );

      try {
        // Re-authenticate user
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);

        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setPasswordConfirmation("");
      } catch (error) {
        alert("Error updating password: " + error.message);
      }
    } else {
      alert("Error: Unable to fetch user details or user email.");
    }
  };

  const handleDeleteTutor = (tutorId) => {
    setSelectedTutorId(tutorId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTutor = async () => {
    if (selectedTutorId) {
      const tutorDocRef = doc(db, "users", selectedTutorId);

      // Delete the tutor document
      await deleteDoc(tutorDocRef);

      // Remove the tutor's ID from the 'tutorIds' array in the admin document
      const adminDocRef = doc(db, "admins", auth.currentUser.uid); // Assuming the current user is the admin
      await updateDoc(adminDocRef, {
        tutorIds: arrayRemove(selectedTutorId),
      });

      // Remove the tutor from the local state
      setTutorsData((prevData) =>
        prevData.filter((tutor) => tutor.id !== selectedTutorId)
      );

      setSelectedTutorId(null);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, "admins", uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setLocation(userDocSnapshot.data().location);
          const fetchedTutorIds = await userDocSnapshot.data().tutorIds;
          const fetchedTutorsData = [];
          if (
            fetchedTutorIds.length > 0 &&
            fetchedTutorIds[0] !== "" &&
            Array.isArray(fetchedTutorIds)
          ) {
            for (let id of fetchedTutorIds) {
              const tutorDocRef = await doc(db, "users", id);

              const tutorSnapshot = await getDoc(tutorDocRef);
              if (tutorSnapshot.exists()) {
                fetchedTutorsData.push({ ...tutorSnapshot.data(), id });
              }
            }
          }

          setTutorsData(fetchedTutorsData);
        } else {
          console.log("No such admin!");
        }
      } else {
        console.log("No user is signed in");
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow-xl mb-12 md:mt-5 mt-2 md:p-8 p-3 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto ">
      <h1 className="font-semibold text-center md:text-lg xs:text-lg text-sm uppercased mb-4 text-gray-900">
        {location}
      </h1>
      <form className="space-y-6">
        <div className="flex items-center justify-center bg-gray-100 border rounded-xl">
          <div className="p-6 space-y-4 bg-white shadow-md rounded-lg w-full">
            <h1 className="flex flex-col items-center justify-center font-semibold text-center md:text-lg text-sm uppercase mb-4 text-gray-700 border-b pb-2">
              Update Password
            </h1>
            <form
              onSubmit={(e) => handleUpdatePassword(e)}
              className="space-y-4"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={(e) => handleUpdatePassword(e)}
                className="w-full px-3 py-2 bg-indigo-400 text-white rounded-md hover:bg-indigo-500"
              >
                Update
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border p-4">
          <h2 className="flex flex-col items-center justify-center font-semibold text-center md:text-lg text-sm uppercase mb-4 text-gray-700 border-b pb-2">
            MANAGE Tutors
            <span className="md:text-xs text-xxs font-light my-2 capitalize">
              Click to edit
            </span>
          </h2>

          <ul className="space-y-4 mt-4">
            {tutorsData.map((tutor) => {
              return (
                <li
                  key={tutor.id}
                  className="p-3 bg-gray-50 border rounded-lg cursor-pointer hover:bg-indigo-300 hover:shadow-md focus:bg-indigo-400 focus:outline-none transition-all duration-200 flex items-center justify-between"
                  onClick={() => navigate(`/edit-tutor/${tutor.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <AiOutlineUser className="h-8 w-8 text-gray-100 p-1 bg-indigo-400 rounded-full" />
                    <span className="text-gray-700 font-medium md:text-md text-xs">
                      {tutor.fName} {tutor.lName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AiOutlineDelete
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTutor(tutor.id);
                      }}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-center relative group">
            <button
              onClick={() => navigate("/create-tutor")}
              title="Add Tutor"
              className="peer mt-4 flex items-center justify-center w-12 h-12 bg-indigo-400 border-2 border-indigo-400 text-white rounded-full hover:bg-white hover:text-indigo-400 hover:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-200 transition-all duration-200"
            >
              <AiOutlinePlus className="text-xl" />
            </button>
            <div className="peer-hover:block hidden absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 px-2 py-1 text-xs text-white bg-indigo-400 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Add Tutor
            </div>
          </div>
        </div>
      </form>
      {showDeleteModal ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-96">
            <h2 className="font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this tutor?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteTutor}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTutor}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AdminEditProfile;
