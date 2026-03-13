const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")

const app = express()

/* Middleware */

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname)))

/* MongoDB connection */

mongoose.connect("mongodb+srv://sablekalpesh07_db_user:o1jyzlCqAIMiq9mj@cluster0.nlntkfe.mongodb.net/")

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
const roomPrices = {
deluxe:120,
suite:220,
presidential:350
}

function calculatePrice(){

let checkin = new Date(document.getElementById("checkin").value)
let checkout = new Date(document.getElementById("checkout").value)
let room = document.getElementById("roomType").value

let price = roomPrices[room]

let nights = (checkout - checkin) / (1000*60*60*24)

if(nights <= 0){
document.getElementById("totalPrice").innerText =
"Check-out must be after check-in"
return
}

let total = nights * price

document.getElementById("totalPrice").innerText =
"Total Price: $" + total + " for " + nights + " nights"

}
const BookingSchema = new mongoose.Schema({

name:String,
email:String,
room:String,
checkin:String,
checkout:String,
payment:String

})

const Booking = mongoose.model("Booking",BookingSchema)
app.post("/book-room", async (req,res)=>{

const {name,email,room,checkin,checkout} = req.body

const booking = new Booking({
name,
email,
room,
checkin,
checkout
})

await booking.save()

res.json("Room booked successfully")

})
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

res.json("User Registered Successfully")

}catch(err){

res.json("Signup Error")

}

})

/* Login API */

app.post("/login", async (req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){

return res.json("User not found")

}

const validPassword = await bcrypt.compare(password,user.password)

if(validPassword){

res.json("Login Successful")

}else{

res.json("Invalid Password")

}

}catch(err){

res.json("Login Error")

}

})
/* Booking API */
app.post("/book-room", async (req,res)=>{

const {name,email,room,checkin,checkout} = req.body

const booking = new Booking({
name,
email,
room,
checkin,
checkout
})

await booking.save()

res.json("Room booked successfully")

})


/* Start server */

app.listen(5000, ()=>{
console.log("Server running on port 5000")
})
app.get("/bookings", async (req,res)=>{

let bookings = await Booking.find()

res.json(bookings)

})
app.get("/social-links", (req,res)=>{

res.json({
instagram:"https://www.instagram.com/",
facebook:"https://www.facebook.com/",
twitter:"https://twitter.com/"
})

})
app.get("/", (req,res)=>{

res.sendFile(path.join(__dirname,"index.html"))

})