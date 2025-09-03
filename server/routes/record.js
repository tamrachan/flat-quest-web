import express from "express";

// Connects to the database
import db from "../db/connection.js";

// To convert id from string to ObjectId
import { ObjectId } from "mongodb";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create instance of express router
const router = express.Router();

// JWT Secret
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // now you can access user info in routes
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is protected", user: req.user });
});

async function printAll() {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    console.log(results);
}

// GET '/' fetches a list of all the records
router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

async function emailExists(email) {
    const collection = await db.collection("users");
    const dbEmail = await collection.findOne({ email: email });

    return dbEmail !== null;
}

async function usernameExists(user) {
    const collection = await db.collection("users");
    const dbUser = await collection.findOne({ user: user });

    return dbUser !== null;
}

async function groupCodeExists(code) {
    const collection = await db.collection("users");
    const groupCode = await collection.findOne({ code: code });

    return groupCode !== null;
}

// Not tested yet
async function passwordValidation(pass) {
    // // At least one lowercase, one uppercase, one number, minimum 8 characters
    // const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    // if (pattern.test(pass)) {
    //     console.log(pass + " is a valid password");
    //     return true;
    // }
    // console.log(pass + " is not a valid password");
    // return false;
    
    if (pass.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(pass)) {
        return false;
    }   
    if (!/[a-z]/.test(pass)) {
        return false;
    }  
    if (!/[0-9]/.test(pass)) {
        return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) { // /\W|_/g.test(pass) ) { // 
        return false;
    }
    console.log(pass + " is a valid password");
    return true;
}

// POST '/register' creates a new user in the collection
router.post("/register", async (req, res) => {
    try {

        const password = await passwordValidation(req.body.pass);
        if ( ! password ) {
            console.log("Password not valid.");
            return res.status(400).send("password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        }

        const hashedPassword = await bcrypt.hash(req.body.pass, 10);

        const email_exists = await emailExists(req.body.email);
        if (email_exists) {
            console.log("Email already exists.");
            return res.status(400).send("Email already exists");
        }
        console.log("email is available");

        const username_exists = await usernameExists(req.body.user);
        if (username_exists) {
            console.log("Username already exists.");
            return res.status(400).send("Username already exists");
        }

        const valid_group_code = await groupCodeExists(req.body.groupCode);
        if (req.body.role == "member" && !valid_group_code) {
            console.log("Group code does not exist.");
            return res.status(400).send("Group code does not exist");
        }

        if (req.body.role == "leader" && valid_group_code) {
            console.log("Group code shouldn't exist - regenerate one.");
            return res.status(400).send("Group code already exists");
        }
        console.log("email is available");

        console.log("User: " + req.body.user + " Hashed: " + hashedPassword);
        
        let newDocument = {
            name: req.body.name,
            user: req.body.user,
            email: req.body.email,
            pass: hashedPassword,
            role: req.body.role,
            code: req.body.groupCode,
            icon: req.body.defaultIcon
        };

        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        
        // Send result
        res.send(result).status(204);
        console.log("Successfully added user to db");
        printAll();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.user,
      email: user.email,
      role: user.role,
      code: user.code,
      icon: user.icon 
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

router.post('/login', async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const collection = await db.collection("users");

    // Try to match by email OR username
    const user = await collection.findOne({
      $or: [{ email }, { user: email }] // logical OR
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Success — respond with user data
    const token = generateToken(user);
    res.status(200).json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// TODO: Add a delete user function
// DELETE '/' deletes a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)};

        const collection = db.collection("users");
        let result = await collection.deleteOne(query);

        // Send success message
        res.send(result).status(200);

        console.log("Removed user");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

async function getFlatmatesByCode(code) {
    let collection = await db.collection("users");
    let flatmates = await collection.find({ code: code }).toArray();
    console.log(flatmates, "gjjf");

    return flatmates;
}

// GET '/' fetches a list of all the records
router.get("/flatmates", async (req, res) => {
    const flatmates = await getFlatmatesByCode(req.query.code);
    console.log(req.query.code, "tegs");

    flatmates.forEach(user => {
      console.log(user.user, user.name); 
    });

    res.send(flatmates).status(200);
});

// NOT SURE how to test
// GET fetches a list of the records for that specific username
router.get("/flatpage/:username", async (req, res) => { 
    let collection = await db.collection("users");
    let results = await collection.find({$or: [ {"user": req.params.username}, {"email": req.params.username} ]})
    // .toArray()
    .then(user => res.json(user))
    .catch(err => res.json(err))
    // .toArray()  
    // .catch(err => {
    //     console.error("Error fetching records:", err);
    //     res.status(500).send("Error fetching records");
    // });
    // res.send(results).status(200);
});

export default router;