
import React, { useState, useMemo, useEffect } from 'react';
import type { FrfEntity, AnyRecord, FilterDefinition } from '../types';
import { fetch_frf_list, delete_frf_record } from '../services/mockApi';
import { hasPermission } from "../rbac/hasPermission";

interface ListViewProps {
  entity: FrfEntity;
  on_select_record: (id: string) => void;
  on_create_click: () => void;
  on_edit_click: (record: AnyRecord) => void;
}

type SortConfig = {
  key: string;
  direction: 'ascending' | 'descending';
} | null;

const format_value = (value: any): string => {
  if (typeof value === 'number' && !isNaN(value)) {
    if (value > 10000 || (String(value).includes('.') && String(value).split('.')[1].length === 2)) {
       return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    return new Date(value).toLocaleDateString();
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value ?? '');
}

const FilterControl: React.FC<{ filter_def: FilterDefinition, value: any, on_change: (key: string, value: any) => void}> = ({ filter_def, value, on_change }) => {
    const common_classes = "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm";
    switch (filter_def.type) {
        case 'text':
            return <input type="text" placeholder={filter_def.label} value={value || ''} onChange={(e) => on_change(filter_def.key, e.target.value)} className={common_classes} />;
        case 'dropdown':
            return (
                <select value={value || ''} onChange={(e) => on_change(filter_def.key, e.target.value)} className={common_classes}>
                    <option value="">All {filter_def.label}s</option>
                    {filter_def.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'range':
            return (
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={value?.min || ''} onChange={(e) => on_change(filter_def.key, { ...value, min: e.target.value })} className={`${common_classes} text-center`} />
                    <span className="text-gray-500">-</span>
                    <input type="number" placeholder="Max" value={value?.max || ''} onChange={(e) => on_change(filter_def.key, { ...value, max: e.target.value })} className={`${common_classes} text-center`} />
                </div>
            );
        case 'daterange':
             return (
                <div className="flex items-center gap-2">
                    <input type="date" value={value?.start || ''} onChange={(e) => on_change(filter_def.key, { ...value, start: e.target.value })} className={`${common_classes} text-center`} />
                    <span className="text-gray-500">-</span>
                    <input type="date" value={value?.end || ''} onChange={(e) => on_change(filter_def.key, { ...value, end: e.target.value })} className={`${common_classes} text-center`} />
                </div>
            );
        default: return null;
    }
};

export const ListView: React.FC<ListViewProps> = ({ entity, on_select_record, on_create_click, on_edit_click }) => {
  const [records, set_records] = useState<AnyRecord[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [search_term, set_search_term] = useState('');
  const [sort_config, set_sort_config] = useState<SortConfig>(null);
  const [filters, set_filters] = useState<Record<string, any>>({});
  const [show_filters, set_show_filters] = useState(false);

  const load_records = () => {
    set_loading(true);
    fetch_frf_list(entity.id)
      .then(set_records)
      .catch(err => {
        console.error(err);
        set_error(`Failed to load ${entity.name} data.`);
      })
      .finally(() => set_loading(false));
  };

  useEffect(() => {
    load_records();
    set_search_term('');
    set_sort_config(null);
    set_filters({});
    set_show_filters(false);
  }, [entity.id]);
  
  const handle_delete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
          try {
              await delete_frf_record(entity.id, id);
              load_records();
          } catch (err: any) {
              alert(err.message || 'You do not have permission to delete this record.');
          }
      }
  };

  const filtered_and_sorted_records = useMemo(() => {
    let filtered_items = [...records];
    const active_filter_keys = Object.keys(filters).filter(key => filters[key]);
    if (active_filter_keys.length > 0) {
        filtered_items = filtered_items.filter(record => {
            return active_filter_keys.every(key => {
                const filter_value = filters[key];
                const record_value = (record as any)[key];
                const filter_def = entity.filters?.find(f => f.key === key);
                if (!filter_def || record_value === undefined) return true;
                switch (filter_def.type) {
                    case 'text': case 'dropdown':
                        return String(record_value).toLowerCase().includes(String(filter_value).toLowerCase());
                    case 'range':
                        const val = parseFloat(record_value);
                        if (filter_value.min && val < parseFloat(filter_value.min)) return false;
                        if (filter_value.max && val > parseFloat(filter_value.max)) return false;
                        return true;
                    case 'daterange':
                        const r_date = new Date(record_value);
                        if (filter_value.start && r_date < new Date(filter_value.start)) return false;
                        if (filter_value.end && r_date > new Date(filter_value.end)) return false;
                        return true;
                    default: return true;
                }
            });
        });
    }
    if (search_term) {
        filtered_items = filtered_items.filter(record =>
            entity.summary_fields.some(field =>
                String((record as any)[field] ?? '').toLowerCase().includes(search_term.toLowerCase())
            )
        );
    }
    if (sort_config) {
      filtered_items.sort((a, b) => {
        const a_val = (a as any)[sort_config.key];
        const b_val = (b as any)[sort_config.key];
        if (a_val < b_val) return sort_config.direction === 'ascending' ? -1 : 1;
        if (a_val > b_val) return sort_config.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered_items;
  }, [records, search_term, sort_config, entity.id, filters]);

const [isReadOnly, setIsReadOnly] = useState(true);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = (user?.role || "member").toLowerCase();

const canCreate = hasPermission(role, entity.id, "create");
const canUpdate = hasPermission(role, entity.id, "update");
const canDelete = hasPermission(role, entity.id, "delete");


  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto relative">
           <input
            type="text"
            placeholder={`Search ${entity.name}...`}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 placeholder-gray-600"
            value={search_term}
            onChange={(e) => set_search_term(e.target.value)}
          />
           <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={on_create_click} disabled={!canCreate} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${!canCreate ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"} `}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
            <div className="text-center py-10">Loading...</div>
        ) : error ? (
            <div className="text-center py-10 text-red-600">Error: {error}</div>
        ) : (
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {entity.summary_fields.map(field => (
                <th key={field} className="p-2 text-xs md:p-4 md:text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => set_sort_config({key: field, direction: sort_config?.key === field && sort_config.direction === 'ascending' ? 'descending' : 'ascending'})}>
                  {field.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
              <th className="p-2 text-xs md:p-4 md:text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered_and_sorted_records.map(record => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => on_select_record(record.id)}>
                {entity.summary_fields.map((field, index) => (
                  <td key={field} className={`p-2 text-sm md:p-4 ${index === 0 ? 'font-medium text-indigo-600' : 'text-gray-700'}`}>
                    {format_value((record as any)[field])}
                  </td>
                ))}
                <td className="p-2 md:p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button disabled={!canUpdate} onClick={(e) => { e.stopPropagation(); on_edit_click(record); }} className={`p-1 ${ canUpdate ? "text-gray-500 hover:text-indigo-600" : "text-gray-400 cursor-not-allowed" }`} title={canUpdate ? "Edit" : "No permission to edit"} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button disabled={!canDelete} onClick={(e) => handle_delete(e, record.id)} className={`p-1 ${ canDelete ? "text-gray-500 hover:text-red-600" : "text-gray-400 cursor-not-allowed" }`} title={canDelete ? "Delete" : "No permission to delete"} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};
