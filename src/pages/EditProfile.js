import React, { useState, useEffect, useRef } from "react";


function EditProfile() {

    const [workLocation, setWorkLocation] = useState('Math Lab');
    const [languagesSpoken, setLanguagesSpoken] = useState([]);

    const handleLanguageChange = (event) => {
        const { value, checked } = event.target;

        if (checked && !languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => [...prevLanguages, value]);
        } else if (!checked && languagesSpoken.includes(value)) {
            setLanguagesSpoken(prevLanguages => prevLanguages.filter(lang => lang !== value));
        }
    };

    const [selectedCells, setSelectedCells] = useState({});
    const isDragging = useRef(false);

    const handleMouseDown = (timeLabel, day) => {
        isDragging.current = true;
        toggleSelection(timeLabel, day);
    };

    const handleMouseEnter = (timeLabel, day) => {
        if (isDragging.current) {
            toggleSelection(timeLabel, day);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const toggleSelection = (timeLabel, day) => {
        setSelectedCells(prev => {
            const key = `${day}-${timeLabel}`;
            if (prev[key]) {
                const newSelection = { ...prev };
                delete newSelection[key];
                return newSelection;
            } else {
                return { ...prev, [key]: true };
            }
        });
    };


    function handleEditProfile(e){
        e.preventDefault();
        console.log("hello")
    }


    //get info based on use effect and use that to display what we currently have




  return(
   
    <div className="mt-5 border-4 border-blue-600 bg-white p-8 rounded-xl lg:w-6/12 md:7/12 w-10/12 mx-auto">
        <h1 className="font-bold text-center text-xl mb-4 text-blue-500">
            Edit Profile
        </h1>
        <form className="space-y-6">
            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1">I work in the: </h1>
                <select 
                    className="border rounded mt-2 p-2 w-full col-span-3"
                    value={workLocation}
                    onChange={(e)=>setWorkLocation(e.target.value)}
                >
                    <option value="Math Lab">Math Lab</option>
                    <option value="English Lab">English Lab</option>
                    <option value="Reading Lab">Reading Lab</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Social Studies Lab">Social Studies Lab</option>
                </select>
            </div>
            
            <div className="grid grid-cols-4 grid-rows-1 items-center gap-4 w-full">
                <h1 className="col-span-1">I speak: </h1>
                    <div className="flex mt-2 space-x-2 col-span-3">
                        <label className="inline-flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-checkbox" 
                                value="Chinese"
                                checked={languagesSpoken.includes('Chinese')}
                                onChange={handleLanguageChange}
                            />
                            <span className="ml-2">Chinese</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-checkbox" 
                                value="Korean"
                                checked={languagesSpoken.includes('Korean')}
                                onChange={handleLanguageChange}
                            />
                            <span className="ml-2">Korean</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-checkbox" 
                                value="Spanish"
                                checked={languagesSpoken.includes('Spanish')}
                                onChange={handleLanguageChange}
                            />
                            <span className="ml-2">Spanish</span>
                        </label>
                    </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 w-full">
                <h1 className="col-span-1">Hours Available: </h1>



                <div className="grid grid-cols-5 gap-2 mt-2 col-span-3" onMouseUp={handleMouseUp}>
                    <div></div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                        <div key={day} className="text-center font-semibold">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: 16 }, (_, i) => {
                        // Adjusted logic for non-military time
                        let hour = 9 + Math.floor(i / 2);
                        const period = hour >= 12 ? "PM" : "AM";
                        if (hour > 12) hour -= 12;  // Convert to 12-hour format
                        const minute = i % 2 === 0 ? "00" : "30";
                        const timeLabel = `${hour}:${minute}${period}`;

                        return (
                            <React.Fragment key={timeLabel}>
                                <div className="font-semibold">{timeLabel}</div>
                                {["Monday", "Tuesday", "Wednesday", "Thursday"].map(day => (
                                    <div 
                                        key={day} 
                                        className={`w-10 h-10 border rounded-full cursor-pointer ${selectedCells[`${day}-${timeLabel}`] ? 'bg-gray-400' : ''}`}
                                        onMouseDown={() => handleMouseDown(timeLabel, day)}
                                        onMouseEnter={() => handleMouseEnter(timeLabel, day)}
                                    ></div>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </div>

            </div>



            <div className="">
                <button type="button" onClick={handleEditProfile} className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                    Submit
                    </button>
            </div>
        </form>
    </div>

        


  )
}

export default EditProfile;
