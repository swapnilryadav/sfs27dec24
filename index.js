const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require('multer');
const path = require('path');
const fs = require("fs");


const app = express();
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12754289",
    password: "TwqMcRduy5",
    database: "sql12754289"
});

//set up multer for file upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name according to timestamp
    },
});

const upload = multer({storage});

//serve upload statistically

app.use('/uploads', express.static('uploads'));

app.post("/ss", upload.single('file') ,(req, res) => {
    let data = [req.body.rno, req.body.name, req.body.marks, req.file.filename];
    let sql = "INSERT INTO student2 values(?,?,?,?)";
    con.query(sql, data, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
            res.send(result);
        }
    });
});

app.get("/gs", (req, res) => {
    let sql = "SELECT * FROM student2";
    con.query(sql, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.delete("/ds", (req, res) => {
    let data = [req.body.rno];
    fs.unlink("/uploads/" + req.body.image, () => {});
    let sql = "DELETE FROM student2 WHERE rno = ?";
    con.query(sql, data, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    });
});

app.listen(9000, () => {
    console.log("Readt to serve at 9000");
});