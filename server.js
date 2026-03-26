require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")

const app = express()

/* ================= MIDDLEWARE ================= */
app.use(cors())
app.use(express.json())

/* ================= STATIC ================= */
app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
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
  message: String
}))

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

  } catch {
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

    res.json({ message: "Room booked successfully" })

  } catch {
    res.json({ message: "Booking error" })
  }
})

/* ================= CONTACT ================= */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.json({ message: "All fields required" })
    }

    await new Contact({ name, email, message }).save()

    res.json({ message: "Message sent successfully" })

  } catch {
    res.json({ message: "Error saving message" })
  }
})

/* ================= DATA ================= */
app.get("/bookings", async (req, res) => {
  res.json(await Booking.find())
})

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on", PORT))
