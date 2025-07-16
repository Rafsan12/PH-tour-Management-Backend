/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../Modules/User/user.interface";
import { User } from "../Modules/User/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExits = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExits) {
      console.log("Super Admin Already exits");
      return;
    }

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      isVerified: true,
      password: hashPassword,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
