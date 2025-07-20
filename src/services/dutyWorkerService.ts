// This file contains the business logic and data access for duty workers.

import { DutyWorker } from "../models/DutyWorker";
import { fileHandler } from "../utils/fileHandler";

const DATA_FILE = "dutyWorkers.json";

export const dutyWorkerService = {
  /**
   * Retrieves all duty workers, optionally filtered by name.
   * @param name Optional name string to filter by.
   * @returns A promise resolving to an array of DutyWorker objects.
   */
  getAllDutyWorkers: async (name?: string): Promise<DutyWorker[]> => {
    let filteredWorkers =
      await fileHandler.readDataFromFile<DutyWorker>(DATA_FILE);

    if (name) {
      filteredWorkers = filteredWorkers.filter(
        (dutyWorker) => dutyWorker.name === name
      );
    }

    return Promise.resolve(
      filteredWorkers.sort((a, b) => a.name.localeCompare(b.name))
    );
  },

  /**
   * Retrieves a single duty worker by its ID.
   * @param id The ID of the duty worker to retrieve.
   * @returns A promise resolving to a DutyWorker object or null if not found.
   */
  getDutyWorkerById: async (
    id: string
  ): Promise<DutyWorker | null> => {
    const workers = await fileHandler.readDataFromFile<DutyWorker>(
      DATA_FILE
    );
    const worker = workers.find((d) => d.id === id);
    return Promise.resolve(worker || null);
  },

  /**
   * Creates a new duty worker.
   * @param newDutyData The data for the new duty worker (without ID).
   * @returns A promise resolving to the newly created DutyWorker object.
   */
  createDutyWorker: async (
    newDutyWorkerData: DutyWorker
  ): Promise<DutyWorker> => {
    const workers: DutyWorker[] =
      await fileHandler.readDataFromFile<DutyWorker>(DATA_FILE);
    const worker = { ...newDutyWorkerData };
    workers.push(worker);
    await fileHandler.writeDataToFile(DATA_FILE, workers);
    return Promise.resolve(worker);
  },

  /**
   * Updates an existing duty worker.
   * @param id The ID of the duty worker to update.
   * @param updatedDutyWorkerData The new data for the duty.
   * @returns A promise resolving to the updated Duty object or null if not found.
   */
  updateDutyWorker: async (
    id: string,
    updatedDutyWorkerData: Partial<DutyWorker>
  ): Promise<DutyWorker | null> => {
    const workers = await dutyWorkerService.getAllDutyWorkers();
    const index = workers.findIndex((d) => d.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    workers[index] = {
      ...workers[index],
      ...updatedDutyWorkerData,
      id,
    }; // Ensure ID remains unchanged
    await fileHandler.writeDataToFile(DATA_FILE, workers);
    return Promise.resolve(workers[index]);
  },

  /**
   * Deletes a duty worker by its ID.
   * @param id The ID of the duty worker to delete.
   * @returns A promise resolving to true if deleted, false if not found.
   */
  deleteDutyWorker: async (id: string): Promise<boolean> => {
    let workers = await dutyWorkerService.getAllDutyWorkers();
    const initialLength = workers.length;
    workers = workers.filter((d) => d.id !== id);
    await fileHandler.writeDataToFile(DATA_FILE, workers);
    return Promise.resolve(workers.length < initialLength);
  },
};
