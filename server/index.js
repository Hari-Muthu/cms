const express = require("express");
const cors = require("cors")

const db = require("./db/db")
const adminRouter = require("./routes/admin-router");
const userRouter = require("./routes/user-router");

const app = express();

app.use(cors())
app.use(express.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get("/",(req,res) => {
    res.send("Hello World")
})

app.use("/adminApi",adminRouter)
app.use("/userApi",userRouter)

app.listen(5000,()=>{
    console.log("Server started at port 5000");
})