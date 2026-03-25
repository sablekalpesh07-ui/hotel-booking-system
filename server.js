const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")

const app = express()

/* Middleware */
app.use(cors({ origin: "*" }))
app.use(express.json())

/* Serve frontend */
app.use(express.static(__dirname))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

/* MongoDB connection */
mongoose.connect(
"mongodb+srv://sablekalpesh07_db_user:o1jyzlCqAIMiq9mj@cluster0.nlntkfe.mongodb.net/hotelDB?retryWrites=true&w=majority",
{
useNewUrlParser: true,
useUnifiedTopology: true
}
)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("Mongo Error:", err))

/* Schemas */
const User = mongoose.model("User", new mongoose.Schema({
name:String,
email:String,
password:String
}))

const Booking = mongoose.model("Booking", new mongoose.Schema({
name:String,
email:String,
room:String,
checkin:String,
checkout:String,
payment:String
}))

/* Signup */
app.post("/signup", async (req,res)=>{
try{
const {name,email,password} = req.body

if(!name || !email || !password){
return res.json({message:"All fields required"})
}

const existing = await User.findOne({email})
if(existing){
return res.json({message:"User already exists"})
}

const hash = await bcrypt.hash(password,10)

await new User({name,email,password:hash}).save()

res.json({message:"User Registered Successfully"})
}catch(err){
console.log(err)
res.json({message:"Signup Error"})
}
})

/* Login */
app.post("/login", async (req,res)=>{
try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json({message:"User not found"})
}

/* SAFE CHECK */
if(!user.password || user.password.length < 20){
return res.json({message:"Invalid stored password"})
}

const valid = await bcrypt.compare(password,user.password)

if(valid){
res.json({message:"Login Successful"})
}else{
res.json({message:"Invalid Password"})
}

}catch(err){
console.log("LOGIN ERROR:", err)
res.json({message:"Server error"})
}
})

/* Booking */
app.post("/book-room", async (req,res)=>{
try{
const {name,email,room,checkin,checkout,payment} = req.body

if(!name || !email || !room || !checkin || !checkout){
return res.json({message:"All fields required"})
}

await new Booking({
name,email,room,checkin,checkout,payment
}).save()

res.json({message:"Room booked successfully"})
}catch(err){
console.log(err)
res.json({message:"Booking error"})
}
})

/* Get bookings */
app.get("/bookings", async (req,res)=>{
try{
let bookings = await Booking.find()
res.json(bookings)
}catch(err){
console.log(err)
res.json([])
}
})

/* Start server */
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
console.log("Server running on port", PORT)
})
app.get("/contacts", async (req,res)=>{

try{
let contacts = await Contact.find()
res.json(contacts)
}catch(err){
console.log(err)
res.json([])
}

})
async function loadBookings(){

let table = document.getElementById("bookingTable")

if(!table) return

try{

let res = await fetch(API + "/bookings")
let data = await res.json()

data.forEach(b=>{

table.innerHTML += `
<tr>
<td>${b.name}</td>
<td>${b.email}</td>
<td>${b.room}</td>
<td>${b.checkin}</td>
<td>${b.checkout}</td>
<td>${b.payment}</td>
</tr>
`

})

}catch(err){
console.log("Error loading bookings")
}

}

