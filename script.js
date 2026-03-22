const API = "https://hotel-booking-system-8xru.onrender.com"

/* ================= LOGIN ================= */

async function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

try{

let response = await fetch(API + "/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email,
password:password
})
})

let data = await response.json()

alert(data)

if(data === "Login Successful"){
window.location.href="index.html"
}

}catch(err){
alert("Server error")
}

}


/* ================= SIGNUP ================= */

async function signup(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let password = document.getElementById("password").value

try{

let response = await fetch(API + "/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
email:email,
password:password
})
})

let data = await response.json()

alert(data)

if(data === "User Registered Successfully"){
window.location.href="login.html"
}

}catch(err){
alert("Server error")
}

}


/* ================= PRICE CALCULATION ================= */

const roomPrices = {
deluxe:3500,
suite:6000,
presidential:12000
}

function calculatePrice(){

let checkin = new Date(document.getElementById("checkin").value)
let checkout = new Date(document.getElementById("checkout").value)
let room = document.getElementById("roomType").value

let price = roomPrices[room]

let nights = (checkout - checkin)/(1000*60*60*24)

if(nights <= 0){
document.getElementById("totalPrice").innerText =
"Check-out must be after check-in"
return
}

let total = nights * price

document.getElementById("totalPrice").innerText =
"Total Price: ₹" + total + " for " + nights + " nights"

}


/* ================= BOOK ROOM ================= */

async function bookRoom(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let room = document.getElementById("roomType").value
let checkin = document.getElementById("checkin").value
let checkout = document.getElementById("checkout").value

try{

let response = await fetch("https://hotel-booking-system-8xru.onrender.com/book-room",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
email,
room,
checkin,
checkout,
payment:"Cash"
})
})

let data = await response.json()

console.log("SERVER RESPONSE:", data)   // ⭐ IMPORTANT

alert(data)

}catch(err){
console.log("ERROR:", err)              // ⭐ SEE REAL ERROR
alert("Booking failed")
}

}


/* ================= ADMIN BOOKINGS ================= */

async function loadBookings(){

let response = await fetch(API + "/bookings")
let bookings = await response.json()

let table = document.getElementById("bookingTable")

if(!table) return

table.innerHTML=""

bookings.forEach(b=>{

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

}


/* ================= AUTO LOAD ADMIN ================= */

window.onload = function(){
loadBookings()
}
function payNow(){
alert("Payment Successful (Demo)")
}


