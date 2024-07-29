import { Request, Response, NextFunction } from "express";
import { PermissionRoleModel } from "../authentication/permission-role.model";
import { PermissionModel } from "../authentication/permission.model";

function checkRole(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissionRole = PermissionRoleModel.findAll({
      where: {
        idRole: req.user.idRole,
      },
      include: [
        {
          model: PermissionModel,
          attributes: ["permission"],
          required: true
        }
      ]
    });

    const permissions = permissionRole.map((item) => (item.get("PermissionModel") as PermissionModel).permission);
    const constraint = permissions.filter(item => requiredRoles.includes(item));
    if (constraint.length === 0) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }
    next();
  };
}

export default checkRole;

