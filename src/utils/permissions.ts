import { User } from "../models/User";

export type Permission = string;

export function hasPermission(user: User, required: Permission): boolean {
  const perms = user.permissions;

  if (!required.match(/^[A-Za-z0-9]*\.[A-Za-z0-9]*$/))
    throw new Error(`Invalid permission format: ${required}`);

  for (const perm of perms) {
    if (perm === required) return true;
    if (perm.endsWith("*")) {
      const base = perm.slice(0, -1); // remove '*'
      if (required.startsWith(base)) return true;
    }
  }

  return false;
}
