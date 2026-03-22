const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")

const app = express()

/* Middleware */
app.use(cors())
app.use(express.json())

/* Serve frontend files */
app.use(express.static(__dirname))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

/* MongoDB connection */
mongoose.connect("mongodb+srv://sablekalpesh07_db_user:o1jyzlCqAIMiq9mj@cluster0.nlntkfe.mongodb.net/hotelDB?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

/* User Schema */
const UserSchema = new mongoose.Schema({
name:String,
email:String,
password:String
})

const User = mongoose.model("User",UserSchema)

/* Booking Schema */
const BookingSchema = new mongoose.Schema({
name:String,
email:String,
room:String,
checkin:String,
checkout:String,
payment:String
})

const Booking = mongoose.model("Booking",BookingSchema)

/* Signup API */
app.post("/signup", async (req,res)=>{

try{

const {name,email,password} = req.body

const hashedPassword = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashedPassword
})

await user.save()

res.json({message:"User Registered Successfully"})

}catch(err){
res.json({message:"Signup Error"})
}

})

/* Login API */
app.post("/login", async (req,res)=>{
try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json({message:"User not found"})
}

if(!password || !user.password){
return res.json("Server error")
}

const valid = await bcrypt.compare(password,user.password)

if(valid){
res.json({message:"Login Successful"})
}else{
res.json({message:"Invalid Password"})
}

}catch(err){
console.log(err)
res.json({message:"Server error"})
}
})

/* Booking API */
app.post("/book-room", async (req,res)=>{
try{

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

res.json({message:"Room booked successfully"})

}catch(err){
console.log(err)
res.json({message:"Booking error"})
}
})

/* Admin API */
app.get("/bookings", async (req,res)=>{

let bookings = await Booking.find()

res.json({message:"Booking"})

})

/* Start server */
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
