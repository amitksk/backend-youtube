import dotenv from "dotenv";
import connectDB from "./db/indexDB.js";
import app from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then((result)=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`Server is running on port: ${process.env.PORT}`)
        console.log("*MONGODB CONNECTED SUCCESSFUL*")
        console.log("***************************************************************************\n")
    })
})

.catch((err)=>{
    console.log("MongoDB Connection Failed ???",err)
})

