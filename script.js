const API = "https://hotel-booking-system-8xru.onrender.com"


/* ================= LOGIN ================= */
async function login(){

let email = document.getElementById("email")?.value
let password = document.getElementById("password")?.value

if(!email || !password){
alert("Please enter email & password")
return
}

try{

let res = await fetch(API + "/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
})

let data = await res.json()

alert(data.message)

if(data.message === "Login Successful"){
window.location.href = "index.html"
}

}catch(err){
alert("Server error")
}

}

/* ================= SIGNUP ================= */
async function signup(){

let name = document.getElementById("name")?.value
let email = document.getElementById("email")?.value
let password = document.getElementById("password")?.value

if(!name || !email || !password){
alert("Fill all fields")
return
}

try{

let res = await fetch(API + "/signup",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,email,password})
})

let data = await res.json()

alert(data.message)

if(data.message === "User Registered Successfully"){
window.location.href = "login.html"
}

}catch(err){
alert("Server error")
}

}

/* ================= PRICE ================= */
const roomPrices = {
deluxe:3500,
suite:6000,
presidential:12000
}

function calculatePrice(){

let checkin = new Date(document.getElementById("checkin").value)
let checkout = new Date(document.getElementById("checkout").value)
let room = document.getElementById("roomType").value

let nights = (checkout - checkin)/(1000*60*60*24)

if(nights <= 0){
document.getElementById("totalPrice").innerText =
"Check-out must be after check-in"
return
}

let total = nights * roomPrices[room]

document.getElementById("totalPrice").innerText =
"Total Price: ₹" + total + " for " + nights + " nights"

}

async function sendOTP(){
  let email = document.getElementById("email").value

  let res = await fetch(API + "/send-otp",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email})
  })

  let data = await res.json()
  alert(data.message)
}
async function verifyOTP(){
  let email = document.getElementById("email").value
  let otp = document.getElementById("otp").value

  let res = await fetch(API + "/verify-otp",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,otp})
  })

  let data = await res.json()
  alert(data.message)

  if(data.message === "Login Successful"){
    window.location.href = "index.html"
  }
}
/* ================= BOOK ROOM ================= */
async function bookRoom(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let room = document.getElementById("roomType").value
let checkin = document.getElementById("checkin").value
let checkout = document.getElementById("checkout").value

if(!name || !email || !checkin || !checkout){
alert("Fill all fields")
return
}

try{

let res = await fetch(API + "/book-room",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name,email,room,checkin,checkout,payment:"Cash"
})
})

let data = await res.json()

alert(data.message)

}catch(err){
alert("Booking failed")
}

}

/* ================= PAY NOW ================= */
function payNow(){
alert("Payment Successful (Demo)")
}

/* ================= CONTACT ================= */


/* ================= GO TO BOOKING ================= */
function goToBooking(room){

localStorage.setItem("selectedRoom", room)
window.location.href = "booking.html"

}

/* ================= AUTO SET ROOM ================= */
document.addEventListener("DOMContentLoaded", function(){

let room = localStorage.getItem("selectedRoom")

let dropdown = document.getElementById("roomType")

if(room && dropdown){
dropdown.value = room
}

})
// IMAGE ZOOM POPUP

function openImage(src){
document.getElementById("popupImg").src = src
document.getElementById("popup").classList.add("active")
}

function closeImage(){
document.getElementById("popup").classList.remove("active")
}
/* ================= GET CONTACT MESSAGES ================= */


async function loadContacts(){

let table = document.getElementById("contactTable")
if(!table) return

try{

let res = await fetch(API + "/contacts")
let data = await res.json()

console.log("Contacts:", data) // debug

data.forEach(c=>{
table.innerHTML += `
<tr>
<td>${c.name}</td>
<td>${c.email}</td>
<td>${c.phone}</td>
<td>${c.method}</td>
<td>${c.message}</td>
</tr>
`
})

}catch(err){
console.log(err)
}

}

document.addEventListener("DOMContentLoaded", loadContacts)

/* AUTO LOAD */
document.addEventListener("DOMContentLoaded", loadContacts)

async function loadBookings(){

let table = document.getElementById("bookingTable")
if(!table) return

try{

let res = await fetch(API + "/bookings")
let data = await res.json()

console.log("Bookings:", data) // debug

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
console.log(err)
}
}

document.addEventListener("DOMContentLoaded", loadBookings)
const Contact = mongoose.model("Contact", new mongoose.Schema({
name:String,
email:String,
phone:String,
method:String,
message:String
}))
async function submitContact(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let phone = document.getElementById("phone").value
let method = document.getElementById("method").value
let message = document.getElementById("message").value

if(!name || !email || !message){
alert("Fill required fields")
return
}

try{

let res = await fetch(API + "/contact",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,email,phone,method,message
})
})

let data = await res.json()

console.log("CONTACT RESPONSE:", data)

alert(data.message)

}catch(err){
console.log(err)
alert("Error")
}

}


