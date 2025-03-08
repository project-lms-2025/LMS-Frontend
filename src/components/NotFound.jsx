import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const NotFound = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className='m-0' >
            <Sidebar open={open} setOpen={setOpen} />
            {/* Main content */}
            <div
                className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
            >
                <div className="min-h-[90vh]  py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <div className="max-w-4xl text-center">
                        <h1 className="text-9xl font-extrabold text-primary-purple">404</h1>
                        <p className="mt-4 text-3xl text-gray-800 dark:text-white">
                            Page Not Found
                        </p>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                            Sorry, we couldn’t find the page you’re looking for.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-primary-white bg-primary-purple hover:bg-opacity-90 transition-colors duration-200"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
