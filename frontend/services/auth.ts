export function getUser() {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export function getRole() {
  return getUser()?.role || "Member";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
}
