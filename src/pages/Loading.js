import React from 'react';

const Loading = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white opacity-75 z-50">
            <div className="animate-spin w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full"></div>
        </div>
    );
}

export default Loading;