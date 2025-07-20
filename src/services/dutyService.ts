// This file contains the business logic and data access for duties.
import { Duty } from "../models/Duty";
import { DutyType } from "../models/DutyType";
import { DutyWorker } from "../models/DutyWorker";
import { fileHandler } from "../utils/fileHandler";
import { v4 as uuidv4 } from "uuid";
import { dutyWorkerService } from "./dutyWorkerService";
import { dutyTypeService } from "./dutyTypeService";

const DATA_FILE_DUTIES = "duties.json";
const DATA_FILE_DUTY_TYPES = "dutyTypes.json";

// ---------------------------------------------

export const dutyService = {
  /**
   * Retrieves all duties, optionally filtered by date or dutyWorker person.
   * @param date Optional date string (YYYY-MM-DD) to filter by.
   * @param dutyWorker Optional dutyWorker person name to filter by.
   * @returns A promise resolving to an array of Duty objects.
   */
  getAllDuties: async (date?: string, dutyWorker?: string): Promise<Duty[]> => {
    let filteredDuties = await fileHandler.readDataFromFile<Duty>(
      DATA_FILE_DUTIES
    );

    if (date) {
      filteredDuties = filteredDuties.filter((duty) => duty.date === date);
    }
    // else {
    //   const pastTerminalDate = new Date();
    //   pastTerminalDate.setDate(pastTerminalDate.getDate() - 7);
    //   filteredDuties = filteredDuties.filter(
    //     (duty) => new Date(duty.date) > pastTerminalDate
    //   )
    // }
    if (dutyWorker) {
      filteredDuties = filteredDuties.filter(
        (duty) =>
          duty.dutyWorker.name.toLowerCase() === dutyWorker.toLowerCase()
      );
    }
    return Promise.resolve(
      filteredDuties.sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.type.time.localeCompare(b.type.time)
      )
    );
  },

  /**
   * Retrieves a single duty by its ID.
   * @param id The ID of the duty to retrieve.
   * @returns A promise resolving to a Duty object or null if not found.
   */
  getDutyById: async (id: string): Promise<Duty | null> => {
    const duties = await fileHandler.readDataFromFile<Duty>(DATA_FILE_DUTIES);
    const duty = duties.find((d) => d.id === id);
    return Promise.resolve(duty || null);
  },

  /**
   * Creates a new duty.
   * @param newDutyData The data for the new duty (without ID).
   * @returns A promise resolving to the newly created Duty object.
   */
  createDuty: async (newDutyData: Omit<Duty, "id">): Promise<Duty> => {
    const duties: Duty[] = await fileHandler.readDataFromFile<Duty>(
      DATA_FILE_DUTIES
    );
    const duty: Duty = {
      id: uuidv4(), // Generate a unique ID
      ...newDutyData,
    };
    duties.push(duty);
    await fileHandler.writeDataToFile<Duty>(DATA_FILE_DUTIES, duties);
    return Promise.resolve(duty);
  },

  /**
   * Updates an existing duty.
   * @param id The ID of the duty to update.
   * @param updatedDutyData The new data for the duty.
   * @returns A promise resolving to the updated Duty object or null if not found.
   */
  updateDuty: async (
    id: string,
    updatedDutyData: {
      date?: string;
      dutyTypeId?: string;
      dutyWorkerId?: string;
    }
  ): Promise<Duty | null> => {
    const duties = await dutyService.getAllDuties();
    const index = duties.findIndex((d) => d.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }

    const updatedDuty: Partial<Duty> = {};

    if (updatedDutyData.date) updatedDuty.date = updatedDutyData.date;

    let dutyType;
    if (updatedDutyData.dutyTypeId) {
      dutyType = await dutyTypeService.getDutyTypeById(
        updatedDutyData.dutyTypeId
      );
      if (dutyType) updatedDuty.type = dutyType;
    }

    /* "Cleaner" solution by Ola */
    // const returnedWorker = updatedDutyData?.dutyWorkerId
    //   ? await dutyWorkerService.getDutyWorkerById(updatedDutyData.dutyWorkerId)
    //   : null;
    // updatedDuty.dutyWorker = returnedWorker ?? duties[index].dutyWorker;

    let dutyWorker;
    if (updatedDutyData.dutyWorkerId) {
      dutyWorker = await dutyWorkerService.getDutyWorkerById(
        updatedDutyData.dutyWorkerId
      );
      if (dutyWorker) updatedDuty.dutyWorker = dutyWorker;
    }

    duties[index] = {
      ...duties[index],
      ...updatedDuty,
      id,
    }; // Ensure ID remains unchanged
    await fileHandler.writeDataToFile<Duty>(DATA_FILE_DUTIES, duties);
    return Promise.resolve(duties[index]);
  },

  /**
   * Deletes a duty by its ID.
   * @param id The ID of the duty to delete.
   * @returns A promise resolving to true if deleted, false if not found.
   */
  deleteDuty: async (id: string): Promise<boolean> => {
    let duties = await dutyService.getAllDuties();
    const initialLength = duties.length;
    duties = duties.filter((d) => d.id !== id);
    await fileHandler.writeDataToFile<Duty>(DATA_FILE_DUTIES, duties);
    return Promise.resolve(duties.length < initialLength);
  },

  /**
   * Retrieves all duty types, optionally filtered by name or time
   * @param name Optional name string to filter by.
   * @param time Optional time string (HH:MM)to filter by.
   * @returns A promise resolving to an array of Duty objects.
   */
  getAllDutyTypes: async (
    name?: string,
    time?: string
  ): Promise<DutyType[]> => {
    let filteredDutyTypes = await fileHandler.readDataFromFile<DutyType>(
      DATA_FILE_DUTY_TYPES
    );

    if (name) {
      filteredDutyTypes = filteredDutyTypes.filter(
        (dutyTypes) =>
          dutyTypes.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      );
    }
    if (time) {
      filteredDutyTypes = filteredDutyTypes.filter(
        (dutyType) => dutyType.time === time
      );
    }
    return Promise.resolve(
      filteredDutyTypes.sort(
        (a, b) => a.name.localeCompare(b.name) || a.time.localeCompare(b.time)
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
    const types: DutyType[] = await dutyService.getAllDutyTypes();
    const dutyType: DutyType = {
      id: uuidv4(), // Generate a unique ID
      ...newDutyTypeData,
    };
    types.push(dutyType);
    await fileHandler.writeDataToFile<DutyType>(DATA_FILE_DUTY_TYPES, types);
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
    const dutyTypes: DutyType[] = await fileHandler.readDataFromFile<DutyType>(
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
