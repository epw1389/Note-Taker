var fs = require("fs");
var uuidv1 = require('uuid/v1');
var express = require("express");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
    var jsonContent = getNoteJSON();
    return res.json(jsonContent);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = uuidv1();
    console.log(newNote);
    var noteJson = getNoteJSON();
    noteJson.push(newNote);
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(noteJson));
    res.json(noteJson);
});

app.delete("/api/notes/:id",
    function (req, res) {
        var jsonContent = getNoteJSON();
        var updatedJSON = jsonContent.filter(function (data) {
            return data.id != req.params.id;
        });
        fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedJSON));
        res.json(updatedJSON);
    });

function getNoteJSON() {
    var contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    return JSON.parse(contents);
}
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});