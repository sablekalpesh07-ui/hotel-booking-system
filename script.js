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

/* OTP */
async function sendOTP(){
  let email = document.getElementById("email").value

  let res = await fetch(API+"/send-otp",{
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

  let res = await fetch(API+"/verify-otp",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,otp})
  })

  let data = await res.json()
  alert(data.message)

  if(data.message==="Login Successful"){
    window.location.href="index.html"
  }
}

/* BOOK */
async function bookRoom(){
  let name = document.getElementById("name").value
  let email = document.getElementById("email").value
  let room = document.getElementById("roomType").value
  let checkin = document.getElementById("checkin").value
  let checkout = document.getElementById("checkout").value

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
  "Total Price: ₹" + total
}

/* PAY NOW */
function payNow(){
  alert("Payment Successful ✅")
}
