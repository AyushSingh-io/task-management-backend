import express from "express";
import cors from "cors";

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.get("/", (req,res)=>{
    console.log("get route hit")
    res.send("hello world")
})

export default app
