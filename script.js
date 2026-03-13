/* Smooth scroll to booking */

function scrollBooking(){
document.getElementById("booking").scrollIntoView({
behavior:"smooth"
})
}


/* Login system */

const form = document.getElementById("loginForm")

if(form){

form.addEventListener("submit",function(e){

e.preventDefault()

let email = document.getElementById("email").value
let password = document.getElementById("password").value
let msg = document.getElementById("msg")

if(email === "admin@hotel.com" && password === "1234"){

msg.style.color = "green"
msg.innerText = "Login Successful"

}else{

msg.style.color = "red"
msg.innerText = "Invalid Login"

}

})

}


/* Image popup */

function openImage(img){

let popup = document.getElementById("imagePopup")
let popupImg = document.getElementById("popupImg")

popup.style.display = "flex"
popupImg.src = img.src

}

function closeImage(){
document.getElementById("imagePopup").style.display = "none"
}


/* Room slider */

let slideIndex = 0
const slides = document.querySelector(".slides")

if(slides){

function showSlide(){
slides.style.transform = "translateX(" + (-slideIndex * 100) + "%)"
}

function nextSlide(){

if(slideIndex < 4){
slideIndex++
}else{
slideIndex = 0
}

showSlide()
}

function prevSlide(){

if(slideIndex > 0){
slideIndex--
}else{
slideIndex = 4
}

showSlide()
}

setInterval(nextSlide,4000)

}


/* Navbar scroll effect */

window.addEventListener("scroll",function(){

let navbar = document.getElementById("navbar")

if(navbar){

if(window.scrollY > 50){
navbar.classList.add("scrolled")
}else{
navbar.classList.remove("scrolled")
}

}

})


/* Mobile menu */

function toggleMenu(){
document.getElementById("navMenu").classList.toggle("active")
}


/* Room prices */

const roomPrices = {
deluxe:3500,
suite:6000,
presidential:12000
}


/* Room availability */

const roomsAvailable = {
deluxe:3,
suite:2,
presidential:1
}


/* Price calculation */

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
"Total Price: " + total + " for " + nights + " nights"

}


/* Booking */
async function bookRoom(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let checkin = document.getElementById("checkin").value
let checkout = document.getElementById("checkout").value
let room = document.getElementById("roomType").value

let msg = document.getElementById("bookingMsg")

try{

let response = await fetch("https://hotel-booking-system-u6w2.onrender.com/book-room",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
room,
checkin,
checkout
})

})

let data = await response.json()

msg.style.color = "green"
msg.innerText = data

}catch(err){

msg.style.color = "red"
msg.innerText = "Booking failed"

}

}
function payNow(){

alert("Payment Successful! Your room is booked.")

}

async function confirmBooking(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let checkin = document.getElementById("checkin").value
let checkout = document.getElementById("checkout").value
let room = document.getElementById("roomType").value

/* Generate booking ID */

let bookingID = "HOTEL" + Math.floor(Math.random()*100000)

/* Save data in local storage */

localStorage.setItem("bookingID", bookingID)
localStorage.setItem("bookingName", name)
localStorage.setItem("bookingRoom", room)
localStorage.setItem("bookingCheckin", checkin)
localStorage.setItem("bookingCheckout", checkout)

await fetch("https://hotel-booking-system-u6w2.onrender.com/book-room",{

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
payment:"Cash on Arrival",
bookingID
})

})

window.location.href="confirmation.html"

}








row.insertCell(5).innerText = b.payment
window.addEventListener("DOMContentLoaded", function(){

let today = new Date().toISOString().split("T")[0]

document.getElementById("checkin").setAttribute("min", today)
document.getElementById("checkout").setAttribute("min", today)

})
document.getElementById("checkin").addEventListener("change", function(){

let checkin = document.getElementById("checkin").value

document.getElementById("checkout").setAttribute("min", checkin)

})
function checkAvailability(){

let room = document.getElementById("roomType").value
let msg = document.getElementById("availabilityMsg")

if(roomsAvailable[room] > 0){

msg.style.color = "green"
msg.innerText = "Room Available"

}else{

msg.style.color = "red"
msg.innerText = "Room Not Available"

}

}
function selectRoom(room){

document.getElementById("roomType").value = room

document.getElementById("booking").scrollIntoView({
behavior:"smooth"
})

}
async function loadSocialLinks(){

let response = await fetch("https://hotel-booking-system-u6w2.onrender.com/social-links")
let data = await response.json()

document.getElementById("instagram").href = data.instagram
document.getElementById("facebook").href = data.facebook
document.getElementById("twitter").href = data.twitter

}

loadSocialLinks()
