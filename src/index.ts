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

    // Add the route handler for the root path
    app.get('/', (req, res) => {
        res.send('Welcome to the API!'); // or any message you prefer
    });

    // Use the port provided by Render or default to 8000 for local development
    const port = process.env.PORT || 8000;

    // Start the server
    app.listen(port, () => console.log(`Server Started at PORT:${port}`));
}

init();

