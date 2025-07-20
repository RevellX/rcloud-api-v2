// your-api-project/src/app.ts

    ```
4.  **Add scripts to `package.json`:**
    ```json
    "scripts": {
      "start": "node dist/server.js",
      "build": "tsc",
      "dev": "nodemon --exec ts-node src/server.ts"
    },
    ```
5.  **Create `.env` file:**
    ```
    PORT=3001
    ```
6.  **Create the file structure and paste the code into the respective files.**
7.  **Start the development server:**
    ```bash
    npm run dev
    ```

You can then test the API using tools like Postman, Insomnia, or `curl`:

* `GET http://localhost:3001/api/v1/duties`
* `GET http://localhost:3001/api/v1/duties/d1`
* `POST http://localhost:3001/api/v1/duties` with JSON body:
    ```json
    {
        "date": "2025-07-15",
        "time": "18:00",
        "name": "New After-Hours Task",
        "responsible": "Jan Kowalski"
    }
    ```
* `PUT http://localhost:3001/api/v1/duties/d1` with JSON body:
    ```json
    {
        "id": "d1",
        "date": "2025-07-01",
        "time": "16:30",
        "name": "Fischer - Time Adjusted",
        "responsible": "Kuba"
    }
    ```
* `DELETE http://localhost:3001/api/v1/duties/d2`
*/
