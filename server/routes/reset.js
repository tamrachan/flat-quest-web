// Any updates to the users database is here.

import express from "express";

// Connects to the database
import db from "../db/connection.js";

// To convert id from string to ObjectId
import { ObjectId } from "mongodb";

import bcrypt from "bcryptjs";
import { auth } from "./auth.js"

// Create instance of express router
const router = express.Router();

// In your reset.js or users routes
router.get("/me", auth, async (req, res) => {
  try {
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// TODO: POST /reset/send-pin
router.post('/send-pin', async (req, res) => {
  const { email } = req.body;
  const pin = generatePin(); // Generate random 6-digit PIN

  // Save pin to DB or cache, email it to the user
  console.log("pin generated: ", pin);

  res.status(200).send({ message: "PIN sent" });
});

// TODO: POST /reset/verify-pin
router.post('/verify-pin', async (req, res) => {
  const { email, pin } = req.body;
  // Check pin validity from DB or cache
  res.status(200).send({ message: "PIN verified" });
});

// POST /reset/update-password
router.patch('/update-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Basic validation
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await db.collection("users").updateOne(
      { email },
      { $set: { password: hashed } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Password reset successfully." });

  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Clean update-name route
router.patch("/update-name", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required." });
    
    const currentUser = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });
    
    if (currentUser?.name === name) {
      return res.status(200).json({ message: "Name is already set to this value" });
    }
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { name } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ message: "Name updated successfully" });
  } catch (err) {
    console.error("Update name error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update username
router.patch("/update-user", auth, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required." });
    
    const currentUser = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });
    
    if (currentUser?.user === username) {
      return res.status(200).json({ message: "Username is already set to this value" });
    }
    
    // Check if username already exists for another user
    const existing = await db.collection("users").findOne({ user: username });
    if (existing && existing._id.toString() !== req.userId) {
      return res.status(409).json({ message: "Username already in use." });
    }
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { user: username } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ message: "Username updated successfully" });
  } catch (err) {
    console.error("Update username error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update email
router.patch("/update-email", auth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });
    
    const currentUser = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });
    
    if (currentUser?.email === email) {
      return res.status(200).json({ message: "Email is already set to this value" });
    }
    
    // Check if email already exists for another user
    const existing = await db.collection("users").findOne({ email });
    if (existing && existing._id.toString() !== req.userId) {
      return res.status(409).json({ message: "Email already in use." });
    }
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { email } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ message: "Email updated successfully" });
  } catch (err) {
    console.error("Update email error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update group code
router.patch("/update-code", auth, async (req, res) => {
  try {
    const { groupCode } = req.body;
    if (!groupCode) return res.status(400).json({ message: "Group code is required." });
    
    if (groupCode.length !== 6) {
      return res.status(400).json({ message: "Group code must be 6 characters." });
    }
    
    const upperCode = groupCode.toUpperCase();
    const currentUser = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });
    
    if (currentUser?.code === upperCode) {
      return res.status(200).json({ message: "Group code is already set to this value" });
    }
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { code: upperCode } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ message: "Group code updated successfully" });
  } catch (err) {
    console.error("Update group code error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// update icon
router.patch("/update-icon", auth, async (req, res) => {
  try {    
    const iconName = req.body.icon; // values('icon')
    // const iconPath = `/assets/icons/${iconName}.png`;
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { icon: iconName } } //iconPath
    );
    
    res.status(200).json({ message: "Icon updated successfully" });
  } catch (err) {
    console.error("Update icon error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// // Update password (authenticated - requires current password)
// router.patch("/change-password", auth, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
    
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: "Current and new password are required." });
//     }
    
//     const currentUser = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });
//     if (!currentUser) {
//       return res.status(404).json({ message: "User not found." });
//     }
    
//     // Verify current password
//     const isValid = await bcrypt.compare(currentPassword, currentUser.password);
//     if (!isValid) {
//       return res.status(400).json({ message: "Current password is incorrect." });
//     }
    
//     // Check if new password is same as current
//     const isSame = await bcrypt.compare(newPassword, currentUser.password);
//     if (isSame) {
//       return res.status(200).json({ message: "Password is already set to this value" });
//     }
    
//     const hashedNew = await bcrypt.hash(newPassword, 10);
    
//     const result = await db.collection("users").updateOne(
//       { _id: new ObjectId(req.userId) },
//       { $set: { password: hashedNew } }
//     );
    
//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: "User not found." });
//     }
    
//     res.status(200).json({ message: "Password changed successfully" });
//   } catch (err) {
//     console.error("Change password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // PATCH '/' updates a record by id
// router.patch("/:id", async (req, res) => {
//     try {
//         const query = { _id: new ObjectId(req.params.id)};
//         const updates = {
//             $set: {
//                 name: req.body.name,
//                 user: req.body.user,
//                 email: req.body.email,
//                 pass: req.body.pass,
//             }
//         };

//         let collection = await db.collection("users");
//         collection.updateOne(query, updates);
//         res.send(result).status(200);
//         console.log("Successfully updated");

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error updating record");
//     }
// });

export default router;