const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(__dirname))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

mongoose.connect("mongodb+srv://sablekalpesh07_db_user:o1jyzlCqAIMiq9mj@cluster0.nlntkfe.mongodb.net/hotelDB")

.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

const UserSchema = new mongoose.Schema({
name:String,
email:String,
password:String
})

const User = mongoose.model("User",UserSchema)

const BookingSchema = new mongoose.Schema({
name:String,
email:String,
room:String,
checkin:String,
checkout:String,
payment:String
})

const Booking = mongoose.model("Booking",BookingSchema)

app.post("/signup", async (req,res)=>{

const {name,email,password} = req.body

const hashed = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashed
})

await user.save()

res.json("User registered")

})

app.post("/login", async (req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json("User not found")
}

const valid = await bcrypt.compare(password,user.password)

if(valid){
res.json("Login success")
}else{
res.json("Wrong password")
}

})

app.post("/book-room", async (req,res)=>{

const {name,email,room,checkin,checkout,payment} = req.body

const booking = new Booking({
name,
email,
room,
checkin,
checkout,
payment
})

await booking.save()

res.json("Room booked")

})

app.get("/bookings", async (req,res)=>{

const bookings = await Booking.find()

res.json(bookings)

})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log("Server running on",PORT)
})/ Server.js file content goes here
