import * as React from "react";
import './layout.css';

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="bg-white text-gray-900 flex flex-col min-h-screen justify-center items-center px-4
                        scale-105 sm:scale-110 transition-transform origin-top">
            {children}
        </div>
    );
};

export default Layout;