import express, { Request, Response } from "express";
import { dbConnect, sync } from "./lib/database";
import { User } from "./lib/models/User";

// Create an instance of Express
const app = express();

// Define a route that handles GET requests to /users/
app.get("/users/", async (req: Request, res: Response) => {
  // Return an empty array as the response
  await dbConnect();
  await sync();

  const users = User.findAll();

  res.json(users);
});

// Start the Express server on port 3000
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
