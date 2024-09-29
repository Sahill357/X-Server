// import * as dotenv from "dotenv"
// import {initServer} from "./app"


// dotenv.config();
 


// async function init (){
//     const app = await initServer();
//     app.listen(8000,()=>console.log("Server Started at PORT:8000"));

// }
// init();


import * as dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();

async function init() {
  const app = await initServer();

  // Use the PORT from the environment or default to 8000 for local development
  const PORT = process.env.PORT || 8000;
  
  app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
}

init();
