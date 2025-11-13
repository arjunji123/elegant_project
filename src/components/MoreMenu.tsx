import React, { useState, useRef, useEffect } from 'react';

const MoreMenu = ({ onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    // Close on click outside
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button className="flex flex-col items-center justify-center w-8 h-8 hover:bg-gray-200 rounded">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mb-1"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mb-1"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
            </button>

            {open && (
                <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => { onEdit(); setOpen(false); }}
                    >
                        Edit
                    </button>
                    <button
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => { onDelete(); setOpen(false); }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};
export default MoreMenu;