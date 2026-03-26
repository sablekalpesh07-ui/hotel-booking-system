const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const path = require("path")
const nodemailer = require("nodemailer")

const app = express()

/* ================= EMAIL SETUP ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sablekalpesh07@gmail.com",
    pass: "apei tuan tsyw xdmd" // App password
  }
})

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }))
app.use(express.json())

/* ================= STATIC FILES ================= */
app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

/* ================= DATABASE ================= */
mongoose.connect(
  "mongodb+srv://sablekalpesh07_db_user:o1jyzlCqAIMiq9mj@cluster0.nlntkfe.mongodb.net/hotelDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err))

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
    console.log(err)
    res.json({ message: "Signup Error" })
  }
})

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ message: "User not found" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (valid) {

      /* EMAIL TO USER */
      try {
        await transporter.sendMail({
          from: "Luxury Hotel <sablekalpesh07@gmail.com>",
          to: user.email,
          subject: "Login Alert 🔐",
          html: `
            <h2>Welcome back to Luxury Hotel</h2>
            <p>You have successfully logged in.</p>
            <p>If this wasn't you, please contact support.</p>
          `
        })
      } catch (e) {
        console.log("Email failed (login)")
      }

      res.json({ message: "Login Successful" })

    } else {
      res.json({ message: "Invalid Password" })
    }

  } catch (err) {
    console.log(err)
    res.json({ message: "Server error" })
  }
})

/* ================= BOOK ROOM ================= */
app.post("/book-room", async (req, res) => {
  try {
    const { name, email, room, checkin, checkout, payment } = req.body

    if (!name || !email || !room || !checkin || !checkout) {
      return res.json({ message: "All fields required" })
    }

    /* SAVE BOOKING */
    await new Booking({
      name, email, room, checkin, checkout, payment
    }).save()

    /* EMAIL TO USER */
    try {
      await transporter.sendMail({
        from: "Luxury Hotel <sablekalpesh07@gmail.com>",
        to: email,
        subject: "Booking Confirmation 🏨",
        html: `
          <h2>Booking Confirmed</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Room:</b> ${room}</p>
          <p><b>Check-in:</b> ${checkin}</p>
          <p><b>Check-out:</b> ${checkout}</p>
          <p><b>Payment:</b> ${payment}</p>
          <br>
          <p>Thank you for choosing Luxury Hotel ❤️</p>
        `
      })
    } catch (e) {
      console.log("User email failed")
    }

    /* EMAIL TO ADMIN */
    try {
      await transporter.sendMail({
        from: "System",
        to: "sablekalpesh07@gmail.com",
        subject: "New Booking Received",
        text: `New booking from ${name} (${email})`
      })
    } catch (e) {
      console.log("Admin email failed")
    }

    res.json({ message: "Room booked successfully" })

  } catch (err) {
    console.log(err)
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

  } catch (err) {
    console.log(err)
    res.json({ message: "Error saving message" })
  }
})

/* ================= GET CONTACTS ================= */
app.get("/contacts", async (req, res) => {
  try {
    let contacts = await Contact.find()
    res.json(contacts)
  } catch (err) {
    console.log(err)
    res.json([])
  }
})

/* ================= GET BOOKINGS ================= */
app.get("/bookings", async (req, res) => {
  try {
    let bookings = await Booking.find()
    res.json(bookings)
  } catch (err) {
    console.log(err)
    res.json([])
  }
})

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})

