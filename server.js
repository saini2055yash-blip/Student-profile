
const express = require("express");
const { Pool } = require("pg");

const app = express();


// ===============================
// REQUEST LOGGER
// ===============================

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});


// ===============================
// DATABASE
// ===============================

const pool = new Pool({
    // user: "postgres",
    // host: "localhost",
    // database: "myapp",
    // password: "saini2111khushi",
    // port: 5432
    connectionString: process.env.DATABASE_URL
});


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// STATIC FILES
// ===============================

app.use(express.static("public"));


// ===============================
// USERS PAGE
// ===============================

app.get("/users.html", (req, res) => {
    res.sendFile(__dirname + "/public/users.html");
});


// ===============================
// POST - SAVE USER
// ===============================

app.post("/users", async (req, res) => {

    console.log("POST /users reached");
    console.log("DATA:", req.body);

    const { name, age, mobile, email } = req.body;

    try {

        await pool.query(
            'INSERT INTO users ("Name", "Age", "Mobile", "Email") VALUES ($1, $2, $3, $4)',
            [name, age, mobile, email]
        );

        res.send("User saved successfully");

    } catch (error) {

        console.error("DATABASE ERROR:", error);

        res.status(500).send("Error saving user");
    }
});


// ===============================
// GET - FETCH USERS
// ===============================

app.get("/users", async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM users ORDER BY "ID" ASC'
        );

        res.json(result.rows);

    } catch (error) {

        console.error("DATABASE ERROR:", error);

        res.status(500).send("Error fetching users");
    }
});


// ===============================
// DELETE - DELETE USER
// ===============================

app.delete("/users/:id", async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query(
            'DELETE FROM users WHERE "ID" = $1',
            [id]
        );

        res.send("User deleted successfully");

    } catch (error) {

        console.error("DATABASE ERROR:", error);

        res.status(500).send("Error deleting user");
    }
});


// ===============================
// UPDATE - UPDATE USER
// ===============================

app.put("/users/:id", async (req, res) => {

    const { id } = req.params;

    const { name, age, mobile, email } = req.body;

    try {

        await pool.query(
            'UPDATE users SET "Name" = $1, "Age" = $2, "Mobile" = $3, "Email" = $4 WHERE "ID" = $5',
            [name, age, mobile, email, id]
        );

        res.send("User updated successfully");

    } catch (error) {

        console.error("DATABASE ERROR:", error);

        res.status(500).send("Error updating user");
    }
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3003;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
