// This file contains the business logic and data access for duty types.
import { DutyType } from "../models/DutyType";
import { fileHandler } from "../utils/fileHandler";
import { v4 as uuidv4 } from "uuid";

const DATA_FILE_DUTIES = "duties.json";
const DATA_FILE_DUTY_TYPES = "dutyTypes.json";

// ---------------------------------------------

export const dutyTypeService = {
  /**
   * Retrieves all duty types, optionally filtered by name or time
   * @param name Optional name string to filter by.
   * @param time Optional time string (HH:MM)to filter by.
   * @returns A promise resolving to an array of Duty objects.
   */
  getAllDutyTypes: async (
    name?: string,
    time?: string,
    address?: string
  ): Promise<DutyType[]> => {
    let filteredDutyTypes =
      await fileHandler.readDataFromFile<DutyType>(
        DATA_FILE_DUTY_TYPES
      );

    if (name) {
      filteredDutyTypes = filteredDutyTypes.filter(
        (dutyTypes) =>
          dutyTypes.name.toLocaleLowerCase() ===
          name.toLocaleLowerCase()
      );
    }
    if (time) {
      filteredDutyTypes = filteredDutyTypes.filter(
        (dutyType) => dutyType.time === time
      );
    }

    if (address) {
      filteredDutyTypes = filteredDutyTypes.filter(
        (dutyTypes) =>
          dutyTypes.address.toLocaleLowerCase() ===
          address.toLocaleLowerCase()
      );
    }
    return Promise.resolve(
      filteredDutyTypes.sort(
        (a, b) =>
          a.name.localeCompare(b.name) || a.time.localeCompare(b.time)
      )
    );
  },

  /**
   * Retrieves a single duty type by its ID.
   * @param id The ID of the duty type to retrieve.
   * @returns A promise resolving to a DutyType object or null if not found.
   */
  getDutyTypeById: async (id: string): Promise<DutyType | null> => {
    const dutyTypes = await fileHandler.readDataFromFile<DutyType>(
      DATA_FILE_DUTY_TYPES
    );
    const dutyType = dutyTypes.find((d) => d.id === id);
    return Promise.resolve(dutyType || null);
  },

  /**
   * Creates a new duty type.
   * @param newDutyTypeData The data for the new duty type (without ID).
   * @returns A promise resolving to the newly created DutyType object.
   */
  createDutyType: async (
    newDutyTypeData: Omit<DutyType, "id">
  ): Promise<DutyType> => {
    const types: DutyType[] = await dutyTypeService.getAllDutyTypes();
    const dutyType: DutyType = {
      id: uuidv4(), // Generate a unique ID
      ...newDutyTypeData,
    };
    types.push(dutyType);
    await fileHandler.writeDataToFile<DutyType>(
      DATA_FILE_DUTY_TYPES,
      types
    );
    return Promise.resolve(dutyType);
  },

  /**
   * Updates an existing duty type type.
   * @param id The ID of the duty type to update.
   * @param updatedDutyTypeData The new data for the duty type.
   * @returns A promise resolving to the updated DutyType object or null if not found.
   */
  updateDutyType: async (
    id: string,
    updatedDutyTypeData: Partial<DutyType>
  ): Promise<DutyType | null> => {
    const dutyTypes: DutyType[] =
      await fileHandler.readDataFromFile<DutyType>(
        DATA_FILE_DUTY_TYPES
      );
    const index = dutyTypes.findIndex((d) => d.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    dutyTypes[index] = {
      ...dutyTypes[index],
      ...updatedDutyTypeData,
      id,
    }; // Ensure ID remains unchanged
    await fileHandler.writeDataToFile<DutyType>(
      DATA_FILE_DUTY_TYPES,
      dutyTypes
    );
    return Promise.resolve(dutyTypes[index]);
  },

  /**
   * Deletes a duty type by its ID.
   * @param id The ID of the duty type to delete.
   * @returns A promise resolving to true if deleted, false if not found.
   */
  deleteDutyType: async (id: string): Promise<boolean> => {
    let dutyTypes = await fileHandler.readDataFromFile<DutyType>(
      DATA_FILE_DUTY_TYPES
    );
    const initialLength = dutyTypes.length;
    dutyTypes = dutyTypes.filter((d) => d.id !== id);
    await fileHandler.writeDataToFile<DutyType>(
      DATA_FILE_DUTY_TYPES,
      dutyTypes
    );
    return Promise.resolve(dutyTypes.length < initialLength);
  },
};
