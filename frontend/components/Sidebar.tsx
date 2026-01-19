
import React from 'react';
import type { FrfEntity } from '../types';
import { NGO_ICON } from '../constants';


interface SidebarProps {
  entities: FrfEntity[];
  selected_entity: FrfEntity | null;
  on_select_entity: (entity: FrfEntity) => void;
  is_open: boolean;
  set_is_open: (is_open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ entities, selected_entity, on_select_entity, is_open }) => {
  const base_item_class = "flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200";
  const active_item_class = "bg-indigo-600 text-white shadow-lg";
  const inactive_item_class = "text-gray-600 hover:bg-indigo-100 hover:text-indigo-700";

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-in-out z-40 w-64 ${is_open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex items-center justify-center p-4 border-b h-16">
        <div className="w-10 h-10 text-indigo-600">{NGO_ICON}</div>
        <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">Data Hub</h1>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul>
          {entities.map((entity) => (
            <li key={entity.id}>
              <a
                onClick={() => on_select_entity(entity)}
                className={`${base_item_class} ${selected_entity?.id === entity.id ? active_item_class : inactive_item_class}`}
              >
                <span className="w-7 h-7">{entity.icon}</span>
                <span className="ml-4 font-medium">{entity.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} NGO Data Hub</p>
        <p></p>
      </div>
    </aside>
  );
};
