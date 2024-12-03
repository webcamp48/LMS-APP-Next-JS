import {app} from './app';
import dotenv from "dotenv";
import { cloudinaryConfig } from './config/cloudinary';

// Load environment variables
dotenv.config();

// cloudinary config
cloudinaryConfig();


// create server
app.listen(process.env.PORT, (error?: Error) => {
  if (error) {
    console.error("Failed to start the server:", error);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});
