import app from "./app.js";
import connectDB from "./database/index.js"
import dotenv from "dotenv";



dotenv.config({
    path : "./.env"
})


const connectToDatabase = async () => {
    try {
        await connectDB()

        app.listen(process.env.PORT || 7000, () => {
            
            console.log("SERVER LISTENING AT THE PORT : ", process.env.PORT)
        })

    } catch (error) {
        console.log("Error occured while connecting to database : ", error)
        process.exit(1)
    }
}

connectToDatabase();