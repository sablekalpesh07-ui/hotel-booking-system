const API = "https://hotel-booking-system-8xru.onrender.com"

/* LOGIN */
async function login(){
  let email = document.getElementById("email").value
  let password = document.getElementById("password").value

  let res = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  })

  let data = await res.json()

  alert(data.message)

  if(data.message === "Login Successful"){
    window.location.href = "index.html"   // ✅ redirect to home
  }
}

/* SIGNUP */
async function signup(){
  let name = document.getElementById("name").value
  let email = document.getElementById("email").value
  let password = document.getElementById("password").value

  let res = await fetch(API+"/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,password})
  })

  let data = await res.json()
  alert(data.message)
}

/* BOOK NOW REDIRECT */
function goToBooking(room){
  localStorage.setItem("selectedRoom", room)
  window.location.href = "booking.html"
}

/* AUTO SELECT ROOM */
document.addEventListener("DOMContentLoaded", function(){
  let room = localStorage.getItem("selectedRoom")
  let dropdown = document.getElementById("roomType")

  if(room && dropdown){
    dropdown.value = room
  }
})

/* PRICE CALCULATION */
const roomPrices = {
  deluxe: 3500,
  suite: 6000,
  presidential: 12000
}

function calculatePrice(){
  let checkin = document.getElementById("checkin").value
  let checkout = document.getElementById("checkout").value
  let room = document.getElementById("roomType").value

  if(!checkin || !checkout){
    alert("Select dates first")
    return
  }

  let d1 = new Date(checkin)
  let d2 = new Date(checkout)

  let nights = (d2 - d1)/(1000*60*60*24)

  if(nights <= 0){
    document.getElementById("totalPrice").innerText = "Invalid dates"
    return
  }

  let total = nights * roomPrices[room]

  document.getElementById("totalPrice").innerText =
  "Total Price: ₹" + total
}

/* PAY */
function payNow(){
  alert("Payment Successful ✅")
}

/* BOOK ROOM */
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

  let res = await fetch(API+"/book-room",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,room,checkin,checkout})
  })

  let data = await res.json()
  alert(data.message)
}

/* CONTACT */
async function submitContact(){
  let name = document.getElementById("name").value
  let email = document.getElementById("email").value
  let message = document.getElementById("message").value

  let res = await fetch(API+"/contact",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,message})
  })

  let data = await res.json()
  alert(data.message)
}
/* LOAD BOOKINGS */
async function loadBookings(){

  let table = document.getElementById("bookingTable")
  if(!table) return

  let res = await fetch(API + "/bookings")
  let data = await res.json()

  table.innerHTML = ""

  data.forEach(b=>{
    table.innerHTML += `
    <tr>
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.room}</td>
      <td>${b.checkin}</td>
      <td>${b.checkout}</td>
    </tr>
    `
  })
}

/* LOAD CONTACTS */
async function loadContacts(){

  let table = document.getElementById("contactTable")
  if(!table) return

  let res = await fetch(API + "/contacts")
  let data = await res.json()

  table.innerHTML = ""

  data.forEach(c=>{
    table.innerHTML += `
    <tr>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.message}</td>
    </tr>
    `
  })
}

/* AUTO LOAD */
document.addEventListener("DOMContentLoaded", function(){
  loadBookings()
  loadContacts()
})
