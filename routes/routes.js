const fileSystem = require('fs');
const filePath = require('path');

module.exports = app => {

    fileSystem.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        var notesData = JSON.parse(data);

        app.get("/api/notes", function(req, res) {
            res.json(notesData);
        });

        app.post("/api/notes", function(req, res) {
            let newNote = req.body;
            notesData.push(newNote);
            updateDatabase();
            return console.log("New note added: "+newNote.title);
        });

        app.get("/api/notes/:id", function(req,res) {
            res.json(notesData[req.params.id]);
        });

        app.delete("/api/notes/:id", function(req, res) {
            notesData.splice(req.params.id, 1);
            updateDatabase();
            console.log("Deleted note with id "+req.params.id);
        });

        app.get('/notes', function(req,res) {
            res.sendFile(filePath.join(__dirname, "../public/notes.html"));
        });
        
        app.get('*', function(req,res) {
            res.sendFile(filePath.join(__dirname, "../public/index.html"));
        });

        function updateDatabase() {
            fileSystem.writeFile("db/db.json",JSON.stringify(notesData,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

    });

}
