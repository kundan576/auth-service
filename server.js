import "dotenv/config";
import app from "./src/app.js";

import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 8080

const start = async ()=>{

    // connection karege yaha database ka tab app listion hoga 
 await connectDB();
app.listen(PORT,()=>{
    console.log("server is live")
})
}
start().catch((err)=>{
    console.log("failed to connect server",err)
    process.exit(1);
});




