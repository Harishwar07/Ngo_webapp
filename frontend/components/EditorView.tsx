
import React, { useState, useEffect } from 'react';
import type { FrfEntity, AnyRecord, FormField } from '../types';
import { create_frf_record, update_frf_record, fetch_frf_detail } from '../services/mockApi';
import { validateField } from "../utils/validators";
import { validationMap } from "../validation";

const SUBFORM_KEY_MAP: Record<string, string> = {
  student_session_logs: "session_logs",
  volunteer_attendance: "attendance",
  project_attendance_logs: "attendance_logs",
  finance_transactions: "transactions",
};


interface EditorViewProps {
  entity: FrfEntity;
  id?: string;
  on_cancel: () => void;
  on_save_success: () => void;
}

const normalizeDate = (value: any) => {
  if (!value || typeof value !== "string") return "";

  // remove time part
  let date = value.includes("T") ? value.split("T")[0] : value;

  // browser-safe year range
  const year = Number(date.split("-")[0]);
  if (year < 1900 || year > 2100) return "";

  return date;
};


export const EditorView: React.FC<EditorViewProps> = ({ entity, initialData, on_cancel, on_save_success,id }) => {
  const [form_data, set_form_data] = useState<Partial<AnyRecord>>({});
  const [is_saving, set_is_saving] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const [field_errors, set_field_errors] = useState<Record<string, string>>({});
  const toDateInputValue = (value: any) => {
    if (!value) return "";
    if (typeof value === "string" && value.includes("T")) {
        return value.split("T")[0]; // ✅ yyyy-MM-dd
    }
    return value;
    };
  const isDateField = (key: string) =>
    entity.create_fields?.some(f => f.key === key && f.type === "date") ||
    entity.sub_forms?.some(sub =>
      sub.fields.some(f => f.key === key && f.type === "date")
    );

    useEffect(() => {
      if (!id) return;

      fetch_frf_detail(entity.id, id)
        .then((data) => {
          const normalizedData: any = {};

          Object.entries(data).forEach(([key, value]) => {
            // backend → frontend key
            const frontendKey =
              Object.entries(SUBFORM_KEY_MAP)
                .find(([, backendKey]) => backendKey === key)?.[0]
              || key;

            if (Array.isArray(value)) {
              normalizedData[frontendKey] = value.map(row => {
                const r: any = {};
                Object.entries(row).forEach(([k, v]) => {
                  if (isDateField(k)) {
                    r[k] = normalizeDate(String(v ?? ""));
                  } else {
                    r[k] = v;
                  }
                });
                return r;
              });
            } else if (isDateField(frontendKey)) {
              normalizedData[frontendKey] = normalizeDate(String(value ?? ""));
            } else {
              normalizedData[frontendKey] = value;
            }
          });

          // ensure all subforms exist
          entity.sub_forms?.forEach(sub => {
            if (!Array.isArray(normalizedData[sub.key])) {
              normalizedData[sub.key] = [];
            }
          });

          set_form_data(normalizedData);
        })
        .catch(console.error);
    }, [entity.id, id]);








  const handle_change = (key: string, value: any) => {
  const updatedForm = { ...form_data, [key]: value };
  set_form_data(updatedForm);

  const schema = validationMap[entity.id];
  if (!schema || !schema[key]) return;

  const rule = schema[key];
  const error = validateField(key, value, rule, {
    ...form_data,
    [key]: value
    });

    set_field_errors(prev => {
    const updated = { ...prev };

    if (error) updated[key] = error;
    else delete updated[key];

    return updated;
    });


  // 🔁 Cross-field revalidation (start_date → end_date)
  if (key === "start_date" && schema["end_date"]) {
    const endError = validateField(
      "end_date",
      (updatedForm as any).end_date,
      schema["end_date"],
      updatedForm
    );

    set_field_errors(prev => {
      const updated = { ...prev };
      if (endError) updated.end_date = endError;
      else delete updated.end_date;
      return updated;
    });
  }
};



  const handle_subform_change = (subform_key: string, index: number, field_key: string, value: string | number) => {
      set_form_data(prev => {
          const updated_subform = [...((prev as any)[subform_key] || [])];
          updated_subform[index] = { ...updated_subform[index], [field_key]: value };
          return { ...prev, [subform_key]: updated_subform };
      });
  };

  const add_subform_row = (subform_key: string) => {
      set_form_data(prev => ({
          ...prev,
          [subform_key]: [...((prev as any)[subform_key] || []), {}]
      }));
  };

  const remove_subform_row = (subform_key: string, index: number) => {
      set_form_data(prev => {
          const updated_subform = [...((prev as any)[subform_key] || [])];
          updated_subform.splice(index, 1);
          return { ...prev, [subform_key]: updated_subform };
      });
  };

  const validate_form = () => {
    const schema = validationMap[entity.id];
    if (!schema) return true;

    const new_errors: Record<string, string> = {};

    const renderedFields = new Set(
    entity.create_fields
        ?.filter(f => f.type !== "header")
        .map(f => f.key)
    );

    Object.keys(schema).forEach(field => {
    if (!renderedFields.has(field)) return; // ✅ IMPORTANT

    const rule = schema[field];
    const value = (form_data as any)[field];

    if (!rule.required && (value === "" || value === null || value === undefined)) {
        return;
    }

    const error = validateField(field, value, rule, form_data);
    if (error) new_errors[field] = error;
    });



    set_field_errors(new_errors);
    return Object.keys(new_errors).length === 0;
    };


    const handle_submit = async (e: React.FormEvent) => {
  e.preventDefault();
  set_error(null);

  if (!validate_form()) {
    set_error("Please fix the highlighted fields.");
    return;
  }

  set_is_saving(true);

  try {
    const cleaned = { ...form_data };

    delete cleaned.created_by;
    delete cleaned.created_by_date;
    delete cleaned.modified_by;
    delete cleaned.modified_date;

    const hasFile = Object.values(cleaned).some(v => v instanceof File);

    if (hasFile) {
      // ✅ ALWAYS FORMDATA IF FILE EXISTS
      const formData = new FormData();

      Object.entries(cleaned).forEach(([key, value]) => {
        const backendKey = SUBFORM_KEY_MAP[key] || key;

        if (value instanceof File) {
          formData.append(backendKey, value);
        } else if (Array.isArray(value)) {
          formData.append(backendKey, JSON.stringify(value));
        } else if (
          value !== null &&
          value !== undefined &&
          value !== ""
        ) {
          formData.append(backendKey, String(value));
        }
      });

      if (id) {
        await update_frf_record(entity.id, id, formData, true);
      } else {
        await create_frf_record(entity.id, formData, true);
      }
    } else {
      // ✅ JSON ONLY WHEN NO FILE
      const payload: any = {};

      Object.entries(cleaned).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          payload[SUBFORM_KEY_MAP[key] || key] = value;
        }
      });

      if (id) {
        await update_frf_record(entity.id, id, payload);
      } else {
        await create_frf_record(entity.id, payload);
      }
    }

    on_save_success();
  } catch (err: any) {
    console.error(err);
    set_error(err.message || "Failed to save record");
  } finally {
    set_is_saving(false);
  }
};



  
  const render_input = (field: FormField, value: any, onChange: (val: any) => void, compact = false) => {
    const hasError = field_errors[field.key];
    const common_classes = `
    w-full bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2
    ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}
    ${compact ? "p-1 text-sm" : "p-2"}
    `;
    const safeValue =
      field.type === "date"
        ? (typeof value === "string" ? value : "")
        : value ?? "";

    switch (field.type) {
      case "file":
        return (
          <input
            type="file"
            accept="application/pdf"
            onChange={e => onChange(e.target.files?.[0] ?? null)}
            className={common_classes}
          />
        );

      case "textarea":
        return (
          <textarea
            value={safeValue}
            onChange={e => onChange(e.target.value)}
            required={field.required}
            className={common_classes}
            rows={compact ? 1 : 4}
          />
        );

      case "select":
        return (
          <select
            value={safeValue}
            onChange={e => onChange(e.target.value)}
            required={field.required}
            className={common_classes}
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            value={safeValue}
            onChange={e => onChange(e.target.value)}
            required={field.required}
            className={common_classes}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
        <button onClick={on_cancel} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{initialData ? 'Edit' : 'Create New'} {entity.name}</h2>
        <form onSubmit={handle_submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {entity.create_fields?.map(field => {
                    if (field.type === 'header') return <div key={field.key} className="md:col-span-2 border-b border-gray-200 pb-2 mt-4"><h3 className="text-lg font-bold text-gray-800">{field.label}</h3></div>;
                    return (
                        <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <label
  className={`block text-sm font-medium mb-1 ${
    field_errors[field.key] ? "text-red-600" : "text-gray-700"
  }`}
>
{field.label} {field.required && '*'}</label>
                            {render_input(
                                        field,
                                        (form_data as any)[field.key],
                                        (val) => handle_change(field.key, val)
                                        )}

                                        {field_errors[field.key] && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {field_errors[field.key]}
                                        </p>
                                        )}

                        </div>
                    );
                })}
            </div>
            {entity.sub_forms?.map(sub => (
                <div key={sub.key} className="mb-8 border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">{sub.label}</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {sub.fields.map(f => <th key={f.key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-40">{f.label}</th>)}
                                    <th className="px-3 py-2 text-right w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {((form_data as any)[sub.key] || []).map((row: any, idx: number) => (
                                    <tr key={idx}>
                                        {sub.fields.map(f => (
                                            <td key={f.key} className="px-2 py-2 whitespace-nowrap align-top">
                                                {render_input(f, row[f.key], (val) => handle_subform_change(sub.key, idx, f.key, val), true)}
                                            </td>
                                        ))}
                                        <td className="px-2 py-2 whitespace-nowrap text-right align-top">
                                             <button type="button" onClick={() => remove_subform_row(sub.key, idx)} className="text-red-600 hover:text-red-900 p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                             </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={() => add_subform_row(sub.key)} className="mt-3 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Add Row
                    </button>
                </div>
            ))}
            {error && <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button type="button" onClick={on_cancel} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button
  type="submit"
  disabled={is_saving || Object.values(field_errors).some(Boolean)}
  className={`w-full sm:w-auto px-8 py-2 rounded-lg shadow-md transition-colors
    ${
      is_saving || Object.values(field_errors).some(Boolean)
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 text-white"
    }`}
>

                    {is_saving ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}
                </button>
            </div>
        </form>
    </div>
  );
};
