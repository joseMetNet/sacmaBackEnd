import { Request, Response, NextFunction } from "express";
import { PermissionRoleModel } from "../authentication/permission-role.model";
import { PermissionModel } from "../authentication/permission.model";
import { StatusCode, StatusValue } from "../interfaces";

function checkRole(requiredRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const permissionRole = await PermissionRoleModel.findAll({
      where: {
        idRole: req.body.userLogged.idRole,
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
      return res
        .status(StatusCode.Forbidden)
        .json({
          status: StatusValue.Failed,
          data: {
            message: "Access forbidden"
          }
        });
    }
    next();
  };
}

export default checkRole;

