import { ROLE_PERMISSIONS } from "./permissions";

export function hasPermission(
  role: string,
  resource: string,
  action: "read" | "create" | "update" | "delete"
): boolean {
  const normalizedRole = role.toLowerCase(); // ✅ FIX
  const perms = ROLE_PERMISSIONS[normalizedRole] || [];

  if (perms.includes("*")) return true;
  if (perms.includes(`${resource}.*`)) return true;

  return perms.includes(`${resource}.${action}`);
}

