const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

const SERVER_B_URL = 'http://localhost:4000';
// HUOM! Muista asettaa .env tiedostoon API_KEY oikein ennen kuin ajat serverin
const API_KEY = process.env.API_KEY;

// GET /animals - TÄYDENNÄ TÄMÄ
app.get('/animals', async (req, res) => {
  try {
    // TODO 1: Tee fetch-kutsu Server B:lle
    // Server B vaatii API-avaimen jokaisessa pyynnössä
    // Lisää se headers-objektiin:
    //
    // const response = await fetch('http://localhost:4000/database/animals', {
    //   headers: {
    //     'X-API-Key': API_KEY
    //   }
    // });
    //
    // Miksi headers? Server B tarkistaa req.headers["x-api-key"]
    // Jos avain puuttuu tai on väärä → 401 Unauthorized
    
    // TODO 2: Tarkista että vastaus on OK
    // if (!response.ok) { return res.status(...)... }
    
    // TODO 3: Muunna vastaus JSON:ksi
    // const animals = await response.json();
    
    // TODO 4: Rikasta jokainen eläin Wikipedia-datalla
    // const enriched = await Promise.all(
    //   animals.map(async (animal) => {
    //     const wiki = await getWikipedia(animal.species);
    //     return { ...animal, wikipedia_info: wiki };
    //   })
    // );
    
    // TODO 5: Palauta rikastettu data
    // res.json(enriched);
    
    res.json({ error: "Toteuta tämä endpoint" });
  } catch (error) {
    res.status(500).json({ error: 'Virhe datan haussa' });
  }
});

// GET /animals/:id - TÄYDENNÄ TÄMÄ
app.get('/animals/:id', async (req, res) => {
  try {
    // TODO: Samanlainen kuin yllä, mutta yhdelle eläimelle
    
    res.json({ error: "Toteuta tämä endpoint" });
  } catch (error) {
    res.status(500).json({ error: 'Virhe' });
  }
});

// POST /animals - TÄYDENNÄ TÄMÄ
app.post('/animals', async (req, res) => {
  // TODO: Toteuta tämä endpoint
  // 1. Ota body:stä tarvittavat kentät
  // 2. Validoi että name ja species on annettu
  // 3. Tee POST-pyyntö Server B:lle
  // 4. Palauta luotu eläin
  
  res.status(501).json({ error: "Toteuta tämä endpoint" });
});

// DELETE /animals/:id - TÄYDENNÄ TÄMÄ
app.delete('/animals/:id', async (req, res) => {
  // TODO: Toteuta tämä endpoint
  // 1. Ota id parametreista
  // 2. Tee DELETE-pyyntö Server B:lle
  // 3. Tarkista vastaus
  // 4. Palauta tulos
  
  res.status(501).json({ error: "Toteuta tämä endpoint" });
});

// VALMIS APUFUNKTIO - EI TARVITSE MUOKATA
async function getWikipedia(species) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(species)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return { description: 'Ei tietoa', url: null };
    }
    
    const data = await response.json();
    return {
      description: data.extract || 'Ei kuvausta',
      url: data.content_urls?.desktop?.page || null
    };
  } catch (error) {
    return { description: 'Wikipedia-virhe', url: null };
  }
}

app.listen(3000, () => {
  console.log('Server A: http://localhost:3000');
  console.log('Muista käynnistää Server B ensin!');
});