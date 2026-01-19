
import React from 'react';

interface HeaderProps {
  on_toggle_sidebar: () => void;
  is_sidebar_open: boolean;
  title: string;
  entity_name?: string;
  on_logout?: () => void;
  on_login?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ on_toggle_sidebar, is_sidebar_open, title, entity_name, on_logout, on_login }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="flex items-center">
            <button onClick={on_toggle_sidebar} className="p-2 mr-2 md:hidden rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                {entity_name && <span className="text-indigo-600 hidden sm:inline">{entity_name}</span>}
                <span className="text-gray-500 mx-2 hidden sm:inline">/</span>
                {title}
            </h1>
        </div>
        <div className="flex items-center gap-4">
            {on_logout && (
                <button 
                    onClick={on_logout}
                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                    Logout
                </button>
            )}
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                
            </div>
        </div>
    </header>
  );
};
