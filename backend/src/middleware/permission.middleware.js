import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    const role = req.user?.role?.toLowerCase();

    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const permissions = ROLE_PERMISSIONS[role] || [];

    // super admin
    if (permissions.includes("*")) return next();

    const [resource] = permission.split(".");

    if (
      permissions.includes(permission) ||
      permissions.includes(`${resource}.*`)
    ) {
      return next();
    }

    return res.status(403).json({
      message: "Insufficient permissions"
    });
  };
};
