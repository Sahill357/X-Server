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
        res.send('Welcome to the API!'); // or whatever message you prefer
    });

    // Start the server on port 8000
    app.listen(8000, () => console.log("Server Started at PORT:8000"));
}

init();
