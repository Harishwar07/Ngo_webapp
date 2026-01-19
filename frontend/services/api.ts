const API_BASE_URL = "http://localhost:3001/api/v1";

const handle = async (res: Response) => {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) throw new Error(json?.message || text || "Request failed");
  return json;
};

export const api = {
  list: (entity: string) =>
    fetch(`${API_BASE_URL}/${entity}`).then(handle),

  detail: (entity: string, id: string | number) =>
    fetch(`${API_BASE_URL}/${entity}/${id}`).then(handle),

  create: (entity: string, data: any) =>
    fetch(`${API_BASE_URL}/${entity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handle),

  update: (entity: string, id: string | number, data: any) =>
    fetch(`${API_BASE_URL}/${entity}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handle),

  remove: (entity: string, id: string | number) =>
    fetch(`${API_BASE_URL}/${entity}/${id}`, {
      method: "DELETE"
    }).then(handle)
};
