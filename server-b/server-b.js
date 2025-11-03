const express = require("express");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const app = express();

app.use(express.json());

const db = new sqlite3.Database("./animals.db");

// API-avain suojaus
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];

  if (key !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

// Alusta tietokanta - SQLITE!
function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        species TEXT,
        species_fi TEXT,
        habitat TEXT,
        fun_fact TEXT,
        cuteness_level INTEGER
      )
    `);

    db.get("SELECT COUNT(*) as count FROM animals", (err, row) => {
      if (err) {
        console.error("❌ Virhe:", err);
        return;
      }

      if (row.count === 0) {
        console.log("Lisätään testidataa...");

        const stmt = db.prepare(
          "INSERT INTO animals (name, species, species_fi, habitat, fun_fact, cuteness_level) VALUES (?, ?, ?, ?, ?, ?)"
        );

        const animalsToInsert = [
          ["Gary", "Capybara", "Vesisika", "Etelä-Amerikka", "Maailman suurin jyrsijä", 10],
          ["Oscar", "Opossum", "Opossumi", "Pohjois-Amerikka", "Teeskentelee kuolleena", 7],
          ["Quincy", "Quoll", "Pussinäätä", "Australia", "Pieni peto täplillä", 9],
          ["Alex", "Axolotl", "Aksolotli", "Meksiko", "Pysyy ikuisesti toukkana", 10],
          ["Penny", "Pangolin", "Muurahaiskäpy", "Afrikka", "Suomupeitteinen nisäkäs", 8],
          ["Barry", "Binturong", "Binturongi", "Kaakkois-Aasia", "Tuoksuu popcornilta", 9],
          ["Rufus", "Naked Mole-rat", "Kaljurotta", "Itä-Afrikka", "Ei tunne kipua", 2],
        ];

        animalsToInsert.forEach(animal => {
          stmt.run(...animal);
        });

        stmt.finalize(() => {
          console.log("✅ Testidataa lisätty");
        });
      }
    });

    console.log("✅ Tietokanta valmis");
  });
}

// GET /database/animals
app.get("/database/animals", (req, res) => {
  db.all("SELECT * FROM animals ORDER BY id", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /database/animals/:id
app.get("/database/animals/:id", (req, res) => {
  db.get("SELECT * FROM animals WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Ei löytynyt" });
    }
    res.json(row);
  });
});

// POST /database/animals
app.post("/database/animals", (req, res) => {
  const { name, species, species_fi, habitat, fun_fact, cuteness_level } = req.body;

  db.run(
    "INSERT INTO animals (name, species, species_fi, habitat, fun_fact, cuteness_level) VALUES (?, ?, ?, ?, ?, ?)",
    [name, species, species_fi, habitat, fun_fact, cuteness_level],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        "SELECT * FROM animals WHERE id = ?",
        [this.lastID],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

// DELETE /database/animals/:id
app.delete("/database/animals/:id", (req, res) => {
  db.get("SELECT * FROM animals WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Ei löytynyt" });
    }

    db.run("DELETE FROM animals WHERE id = ?", [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Poistettu", animal: row });
    });
  });
});

app.listen(4000, () => {
  initDatabase();
  console.log("Server B: http://localhost:4000");
});