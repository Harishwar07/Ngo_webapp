import React, { useState } from 'react';
import type { FrfEntity, AnyRecord, FormField } from '../types';
import { create_frf_record } from "../services/mockApi";

interface CreateViewProps {
  entity: FrfEntity;
  on_cancel: () => void;
  on_save_success: () => void;
}

export const CreateView: React.FC<CreateViewProps> = ({ entity, on_cancel, on_save_success }) => {

  const [form_data, set_form_data] = useState<Partial<AnyRecord>>(() => {
    const initial_state: Partial<AnyRecord> = {};

    entity.create_fields?.forEach(field => {
      (initial_state as any)[field.key] = field.default_value ?? '';
    });

    entity.sub_forms?.forEach(sub => {
      (initial_state as any)[sub.key] = [];
    });

    return initial_state;
  });

  const [is_saving, set_is_saving] = useState(false);
  const [error, set_error] = useState<string | null>(null);


  /* ---------------------
      INPUT HANDLERS
  --------------------- */

  const handle_change = (key: string, value: any) => {
    set_form_data(prev => ({ ...prev, [key]: value }));
  };


  const handle_subform_change = (subform_key: string, index: number, field_key: string, value: any) => {
    set_form_data(prev => {
      const updated = [...((prev as any)[subform_key] || [])];
      updated[index] = { ...updated[index], [field_key]: value };
      return { ...prev, [subform_key]: updated };
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
      const updated = [...((prev as any)[subform_key] || [])];
      updated.splice(index, 1);
      return { ...prev, [subform_key]: updated };
    });
  };


  /* ---------------------
      NORMALIZE PAYLOAD
  --------------------- */

  const normalize_payload = (entityId: string, data: any) => {
    const payload = { ...data };

    switch (entityId) {

      case "students":
        if (payload.session_logs) {
          payload.student_session_logs = payload.session_logs;
          delete payload.session_logs;
        }
        break;

      case "volunteers":
        if (payload.volunteer_id) {
          payload.volunteer_id_code = payload.volunteer_id;
          delete payload.volunteer_id;
        }
        break;

      case "donors":
        if (payload.donor_id) {
          payload.donor_id_code = payload.donor_id;
          delete payload.donor_id;
        }
        if (payload.type) {
          payload.donor_type = payload.type;
          delete payload.type;
        }
        break;

      case "projects":
        if (payload.project_id) {
          payload.project_id_code = payload.project_id;
          delete payload.project_id;
        }
        if (payload.status) {
          payload.project_status = payload.status;
          delete payload.status;
        }
        if (payload.location) {
          payload.location_name = payload.location;
          delete payload.location;
        }
        break;
    }

    return payload;
  };


  /* ---------------------
        SUBMIT HANDLER
  --------------------- */

  const handle_submit = async (e: React.FormEvent) => {
    console.log("FORM DATA BEFORE NORMALIZE:", form_data);
    console.log("RAW form_data:", form_data);
    const normalized = normalize_payload(entity.id, form_data);
    console.log("AFTER NORMALIZE:", normalized);

    const file = normalized.proof_file_upload;
    console.log("FILE TYPE:", typeof file, file);
    console.log("instanceof File?", file instanceof File);


    e.preventDefault();
    set_error(null);

    // validation
    for (const field of entity.create_fields || []) {
      if (field.type !== 'header' && field.required && !(form_data as any)[field.key]) {
        set_error(`Field "${field.label}" is required.`);
        window.scrollTo(0,0);
        return;
      }
    }

    set_is_saving(true);

    try {
      const normalized = normalize_payload(entity.id, form_data);

      /* 🚀🚀 IMPORTANT:
         If entity has FILE upload → send FormData
      */
      //const hasFileUpload =
        //normalized.proof_file_upload instanceof File;

      const file =
        normalized.proof_file_upload ||
        normalized.proof_file ||
        null;

      const hasFileUpload = file instanceof File;


      if (hasFileUpload) {

        const fd = new FormData();

        Object.entries(normalized).forEach(([key, value]) => {
          if (value instanceof File) {
            fd.append(key, value);
          } else {
            //fd.append(key, JSON.stringify(value));
            fd.append(key, value as any);
          }
        });

        await create_frf_record(entity.id, fd, true);

      } else {
        await create_frf_record(entity.id, normalized);
      }

      on_save_success();

    } catch (err) {
      console.error(err);
      set_error(`Failed to create ${entity.name}. Please try again.`);
    } finally {
      set_is_saving(false);
    }
  };


  /* ---------------------
        RENDER INPUTS
  --------------------- */

  const render_input = (field: FormField, value: any, onChange: (val: any) => void, compact = false) => {

    // FILE UPLOAD — proof_file_upload
    if (field.type === "file") {
        return (
        <input
            type="file"
            name={field.key}
            accept="application/pdf"
            onChange={e => onChange(e.target.files?.[0] ?? null)}
            className="w-full"
        />
        );
    }


    const common_classes =
      `w-full bg-white text-gray-900 border border-gray-300 rounded-lg
       focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400
       ${compact ? 'p-1 text-sm' : 'p-2'}`;

    switch (field.type) {
      case 'textarea':
        return <textarea value={value} onChange={e => onChange(e.target.value)} required={field.required} className={common_classes} rows={compact ? 1 : 4} />;

      case 'select':
        return (
          <select value={value} onChange={e => onChange(e.target.value)} required={field.required} className={common_classes}>
            <option value="">Select...</option>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );

      default:
        return <input type={field.type} value={value} onChange={e => onChange(e.target.value)} required={field.required} className={common_classes} />;
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button onClick={on_cancel} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6">
        ← Back to {entity.name} List
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New {entity.name}</h2>

      <form onSubmit={handle_submit}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {entity.create_fields?.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {render_input(field, (form_data as any)[field.key] || '', (val) => handle_change(field.key, val))}
            </div>
          ))}
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={on_cancel}>Cancel</button>
          <button type="submit" disabled={is_saving}>
            {is_saving ? "Saving..." : "Save Record"}
          </button>
        </div>

      </form>
    </div>
  );
};
