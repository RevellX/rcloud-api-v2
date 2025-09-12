import db from "../utils/database";

export const userService = {
  /**
   * Retrieves a single user by its ID.
   * @param id The ID of the user to retrieve.
   * @returns A promise resolving to a User object or null if not found.
   */
  getById: async (id: string) => {
    const user = await db.User?.findByPk(id);
    return user || null;
  },
};
