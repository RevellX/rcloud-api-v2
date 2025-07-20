import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const fileHandler = {
  /**
   * Reads data from a JSON file, typed with a generic type T.
   * @template T The expected type of the elements in the array.
   * @param {string} stringPath  File path of the file to read from
   * @returns {Promise<T[]>} A promise that resolves with the parsed JSON data as an array of T,
   * or an empty array if the file doesn't exist or is empty/invalid.
   */
  readDataFromFile: async <T>(stringPath: string): Promise<T[]> => {
    try {
      const data = await fs.readFile(stringPath, "utf8");
      const parsedData: unknown = JSON.parse(data);

      if (Array.isArray(parsedData)) {
        return parsedData as T[];
      }

      console.warn(
        `Data file ${stringPath} contained invalid format (not an array). Starting with an empty array.`
      );
      return [];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.log(
          `Data file ${stringPath} not found. Starting with an empty array.`
        );
        return [];
      } else if (error instanceof SyntaxError) {
        console.warn(
          `Invalid JSON in data file ${stringPath}. Starting with an empty array.`
        );
        return [];
      }
      console.error(`Error reading data file ${stringPath}:`, error);
      throw error;
    }
  },

  /**
   * Writes data to a JSON file, typed with a generic type T.
   * @template T The type of the elements in the array to write.
   * @param {string} stringPath  File path of the file to write into
   * @param {T[]} data The data to write to the file.
   * @returns {Promise<void>} A promise that resolves when the data has been written.
   */
  writeDataToFile: async <T>(
    stringPath: string,
    data: T[]
  ): Promise<void> => {
    try {
      await fs.writeFile(
        stringPath,
        JSON.stringify(data, null, 2),
        "utf8"
      );
      console.log(`Data successfully written to ${stringPath}.`);
    } catch (error) {
      console.error(`Error writing data to ${stringPath}:`, error);
      throw error;
    }
  },
};
