import express from "express";

// Connects to the database
import db from "../db/connection.js";

// To convert id from string to ObjectId
import { ObjectId } from "mongodb";

// Create instance of express router
const router = express.Router();

// Add a new task to the "tasks" database
router.post("/new-task", async (req, res) => {
    try {
        let newTask = {
            task: req.body.task, // what is the task
            code: req.body.code, // which group?
            publisher: req.body.publisher, // who created it
            assigned: req.body.assigned, // who is assigned to it
            date_created: req.body.date_created, // date
            complete: req.body.complete, // true/false
            repeat: req.body.repeat // daily/weekly/monthly/yearly/custom
        }

        let collection = await db.collection("tasks");
        let result = await collection.insertOne(newTask);

        // Successfully added to db
        res.send(result).status(204);
        console.log("Successfully added task to db");
    } catch (err) {
        console.error("Task error:", err);
        res.status(500).json({ message: "Server error" });
  }
});

// Add a new personal task to the "personal" database
router.post("/new-personal-task", async (req, res) => {
    try {
        let newPersonalTask = {
            task: req.body.task, // what is the task
            user: req.body.user, // who created it
            date_created: req.body.date_created, // date
            complete: req.body.complete, // true/false
            repeat: req.body.repeat // daily/weekly/monthly/yearly/custom
        }

        let collection = await db.collection("personal");
        let result = await collection.insertOne(newPersonalTask);

        // Successfully added to db
        res.send(result).status(204);
        console.log("Successfully added personal task to db");
    } catch (err) {
        console.error("Task error:", err);
        res.status(500).json({ message: "Server error" });
  }
});

// Get all tasks from the "tasks" database
router.get("/get-tasks", async (req, res) => {
    let collection = await db.collection("tasks");
    let result = await collection.find({}).toArray();
    res.send(result).status(200);
});

// Get all personal tasks from the "personal" database
router.get("/get-personal-tasks", async (req, res) => {
    let collection = await db.collection("personal");
    let result = await collection.find({}).toArray();
    res.send(result).status(200);
});

// change status of task to completed 
router.post("/complete-task", async (req, res) => {
    try {
        let id = req.body._id;
        let collectionName = req.body.collectionName;
        let date_completed = req.body.date_completed;

        if (!collectionName || !id) {
            return res.status(400).json({ message: "Missing collectionName or _id" });
        }

        let result = await db.collection(collectionName).updateOne( { _id: ObjectId.createFromHexString(id)}, {$set: {complete: Boolean(true), date_completed: date_completed} } );
        
        console.log(ObjectId.createFromHexString(id), collectionName, "test", result)
        
        return res.status(200).send(result);
    } catch (err) {
        console.error("Task error:", err);
        return res.status(500).json({ message: "Server error" });
  }
});


// Delete a task by id
// FRONTEND: await fetch(`/task/remove-task/${taskId}`, {
//     method: "DELETE"
// });
router.delete("/remove-task/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const collection = await db.collection("tasks");

        const result = await collection.deleteOne({ _id: new ObjectId(taskId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
        console.log(`Deleted task with id ${taskId}`);
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a personal task by id
router.delete("/remove-personal-task/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const collection = await db.collection("personal");

        const result = await collection.deleteOne({ _id: new ObjectId(taskId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Personal task not found" });
        }

        res.status(200).json({ message: "Personal task deleted successfully" });
        console.log(`Deleted personal task with id ${taskId}`);
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;