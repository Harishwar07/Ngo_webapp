// This file has been updated to connect to a real backend API.
// A mocking layer has been added to facilitate frontend development without a live backend.
import type { AnyRecord, FrfEntity } from '../types';
import * as mock_service from './mockData';

// --- API CONNECTION CONTROL ---

// STEP 1: Set this to `false` to connect to your live backend API.
// When `true`, the app uses the sample data in `services/mockData.ts`.
const USE_MOCK_API = false;

// STEP 2: Set this to the full base URL of your backend server.
// For local development, this is typically http://localhost:<PORT>/api/v1
// For a deployed application, this would be your production API URL.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:3001/api/v1'; 

let CSRF_TOKEN: string | null = null;

export async function loadCsrfToken() {
  const res = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: "include"
  });

  const data = await res.json();

  CSRF_TOKEN = data.csrfToken;              // <-- IMPORTANT
}



// A more descriptive error message for common connection failures.
const CONNECTION_ERROR_MESSAGE = 'Network error: Could not connect to the backend API. Please ensure the backend server is running and that CORS is configured to allow requests from this origin.';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function csrfHeader() {
  return CSRF_TOKEN ? { "X-CSRF-Token": CSRF_TOKEN } : {};
}


/**
 * Handles fetch responses, checks for errors, and parses JSON.
 * This function reads the response body only once to prevent "body stream already read" errors.
 * @param response The raw fetch response.
 * @returns A promise that resolves to the parsed JSON.
 * @throws An error if the network response is not ok.
 */
const handle_response = async (response: Response) => {
  const text = await response.text();

  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {}

  if (!response.ok) {

    if (response.status === 401) {
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error(
        data?.message || "You do not have permission to perform this action"
      );
    }

    throw new Error(data?.message || "Request failed");
  }

  return data;
};


/**
 * Fetches a list of records for a given entity from the backend API.
 * @param entity_id The ID of the entity (e.g., 'students').
 * @returns A promise that resolves to an array of records.
 */
export const fetch_frf_list = async (entity_id: FrfEntity['id']): Promise<AnyRecord[]> => {
  if (USE_MOCK_API) {
    console.log(`[MOCK API] Fetching list for: ${entity_id}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mock_service.get_mock_list(entity_id));
      }, 500); // Simulate network delay
    });
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${entity_id}`, {
      credentials: "include",
      headers: {
        ...csrfHeader()
      }
    });
    return handle_response(response);
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(CONNECTION_ERROR_MESSAGE);
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Fetches the detailed information for a single record from the backend API.
 * @param entity_id The ID of the entity (e.g., 'students').
 * @param record_id The ID of the record to fetch.
 * @returns A promise that resolves to the record object or null if not found.
 */
export const fetch_frf_detail = async (
  entity_id: FrfEntity['id'],
  record_id: string
): Promise<AnyRecord | null> => {

  if (USE_MOCK_API) {
    console.log(`[MOCK API] Fetching detail for: ${entity_id}/${record_id}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mock_service.get_mock_detail(entity_id, record_id));
      }, 500);
    });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${entity_id}/${record_id}/detail`,
      {
        credentials: "include",
        headers: {
          ...csrfHeader()
        }
      }
    );


    if (response.status === 404) return null;

    return await handle_response(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(CONNECTION_ERROR_MESSAGE);
    }
    throw error;
  }
};



/**
 * Creates a new record for a given entity.
 * @param entity_id The ID of the entity (e.g., 'students').
 * @param record_data The data for the new record.
 * @returns A promise that resolves to the newly created record.
 */
export async function create_frf_record(
  entity_id: string,
  data: any,
  isFormData = false
) {
  const response = await fetch(`${API_BASE_URL}/${entity_id}`, {
    method: "POST",
    credentials: "include",
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData
      ? { ...csrfHeader() }               // ❌ NO Content-Type
      : { "Content-Type": "application/json", ...csrfHeader() }
  });

  return handle_response(response);
}



export async function update_frf_record( entity_id: FrfEntity['id'], record_id: string, data: any, isFormData = false ) {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mock_service.update_mock_record(entity_id, record_id, data));
      }, 500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/${entity_id}/${record_id}`, {
    method: "PUT",
    credentials: "include",
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData ? { ...csrfHeader(), "X-CSRF-Token": CSRF_TOKEN || "" } : { "Content-Type": "application/json", ...csrfHeader(), "X-CSRF-Token": CSRF_TOKEN || (window as any).CSRF_TOKEN || "" }
  });

  return handle_response(response);
}


export const delete_frf_record = async (
  entity_id: FrfEntity['id'],
  record_id: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${entity_id}/${record_id}`, {
    method: 'DELETE',
    credentials: "include",
    headers: {
      ...csrfHeader(),
      "X-CSRF-Token": CSRF_TOKEN || (window as any).CSRF_TOKEN || ""
    }
  });

  // 🔥 IMPORTANT: let handle_response throw the real message
  await handle_response(response);
};
