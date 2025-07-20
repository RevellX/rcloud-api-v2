import app from "./app";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
