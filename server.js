require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")
const nodemailer = require("nodemailer")

const app = express()
const otpStore = {}

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }))
app.use(express.json())

/* ================= STATIC ================= */
app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error)
  } else {
    console.log("SMTP READY")
  }
})

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

/* ================= SCHEMAS ================= */
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}))

const Booking = mongoose.model("Booking", new mongoose.Schema({
  name: String,
  email: String,
  room: String,
  checkin: String,
  checkout: String,
  payment: String
}))

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  method: String,
  message: String
}))

/* ================= OTP ================= */
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.json({ message: "Email required" })

    const otp = Math.floor(100000 + Math.random() * 900000)
    otpStore[email] = otp

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`
    })

    res.json({ message: "OTP sent to email" })

  } catch (err) {
    console.log(err)
    res.json({ message: "Error sending OTP" })
  }
})

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body

  if (otpStore[email] == otp) {
    delete otpStore[email]
    return res.json({ message: "Login Successful" })
  }

  res.json({ message: "Invalid OTP" })
})

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({ message: "All fields required" })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.json({ message: "User already exists" })
    }

    const hash = await bcrypt.hash(password, 10)
    await new User({ name, email, password: hash }).save()

    res.json({ message: "User Registered Successfully" })

  } catch (err) {
    res.json({ message: "Signup Error" })
  }
})

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.json({ message: "User not found" })

    const valid = await bcrypt.compare(password, user.password)

    if (valid) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Login Alert",
          html: `<h3>You logged in successfully</h3>`
        })
      } catch {}

      return res.json({ message: "Login Successful" })
    }

    res.json({ message: "Invalid Password" })

  } catch {
    res.json({ message: "Server error" })
  }
})

/* ================= BOOK ROOM ================= */
app.post("/book-room", async (req, res) => {
  try {
    const { name, email, room, checkin, checkout } = req.body

    if (!name || !email || !room || !checkin || !checkout) {
      return res.json({ message: "All fields required" })
    }

    await new Booking({
      name, email, room, checkin, checkout, payment: "Cash"
    }).save()

    try {
      await transporter.sendMail({
        to: email,
        subject: "Booking Confirmed",
        html: `<h3>Your booking is confirmed</h3>`
      })
    } catch {}

    res.json({ message: "Room booked successfully" })

  } catch {
    res.json({ message: "Booking error" })
  }
})

/* ================= CONTACT ================= */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, method, message } = req.body

    if (!name || !email || !message) {
      return res.json({ message: "All fields required" })
    }

    await new Contact({ name, email, phone, method, message }).save()

    res.json({ message: "Message sent successfully" })

  } catch {
    res.json({ message: "Error saving message" })
  }
})

/* ================= DATA ================= */
app.get("/contacts", async (req, res) => {
  res.json(await Contact.find())
})

app.get("/bookings", async (req, res) => {
  res.json(await Booking.find())
})


app.get("/test-mail", async (req,res)=>{
  try{
    await transporter.sendMail({
      to: "sablekalpesh07@gmail.com",
      subject: "Test Mail",
      text: "Working"
    })
    res.send("Mail sent")
  }catch(err){
    console.log(err)
    res.send("Error")
  }
})

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on", PORT))
console.log("EMAIL:", process.env.EMAIL_USER)
console.log("PASS:", process.env.EMAIL_PASS)
