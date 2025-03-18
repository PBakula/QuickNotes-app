# QUICK-NOTES

Aplikacija za upravljanje bilješkama s Google OAuth autentikacijom, razvijena u TypeScript-u s React frontend-om i Node.js/Express backend-om.

## Sadržaj

- [Funkcionalnosti](#funkcionalnosti)
- [Tehnologije](#tehnologije)
- [Arhitektura](#arhitektura)
- [Pokretanje aplikacije](#pokretanje-aplikacije)
  - [Preduvjeti](#preduvjeti)
  - [Instalacija](#instalacija)
  - [Konfiguracija](#konfiguracija)
  - [Pokretanje](#pokretanje)
- [Struktura projekta](#struktura-projekta)
- [API endpoints](#api-endpoints)
- [Autentikacija](#autentikacija)
- [Upravljanje bilješkama](#upravljanje-bilješkama)

## Funkcionalnosti

- **Google OAuth autentikacija** - Prijava korisnika pomoću Google računa
- **Upravljanje bilješkama** - Kreiranje, čitanje, ažuriranje i brisanje bilješki
- **Prilagodljive bilješke** - Mogućnost odabira boje pozadine za svaku bilješku
- **Filtriranje bilješki** - Filtriranje bilješki po bojama
- **Responzivni dizajn** - Prilagodljivo sučelje za različite uređaje

## Tehnologije

### Frontend

- **React** (v19.0.0) - JavaScript biblioteka za izgradnju korisničkih sučelja
- **TypeScript** - Statički tipiziran JavaScript
- **React Router** (v7.3.0) - Upravljanje rutama u React aplikaciji
- **Axios** - HTTP klijent za API pozive
- **Bootstrap** - CSS okvir za responzivni dizajn

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web okvir za Node.js
- **TypeScript** - Statički tipiziran JavaScript
- **MongoDB** - NoSQL baza podataka
- **Mongoose** - ODM (Object Data Modeling) biblioteka za MongoDB
- **Passport.js** - Autentikacijski middleware za Node.js
- **Express Session** - Upravljanje sesijama
- **Connect Mongo** - Pohrana sesija u MongoDB

## Arhitektura

Aplikacija je organizirana kao full-stack MERN (MongoDB, Express, React, Node.js) aplikacija s TypeScript-om.

- **Client** - React aplikacija za frontend
- **Server** - Express aplikacija za backend API
- **MongoDB** - Baza podataka za pohranu korisnika i bilješki

## Pokretanje aplikacije

### Preduvjeti

- Node.js (v14 ili noviji)
- MongoDB (lokalno ili MongoDB Atlas)
- Google OAuth kredencijali (Client ID i Client Secret)

### Instalacija

1. Klonirajte repozitorij:
   ```bash
   git clone https://github.com/your-username/quick-notes.git
   cd quick-notes
   ```

2. Instalacija ovisnosti za client:
   ```bash
   cd client
   npm install
   ```

3. Instalacija ovisnosti za server:
   ```bash
   cd ../server
   npm install
   ```

### Konfiguracija

#### Client (.env)

Stvorite `.env` datoteku u root direktoriju client-a:

```
REACT_APP_API_URL=http://localhost:5001/api
```

#### Server (.env)

Stvorite `.env` datoteku u root direktoriju servera:

```
PORT=5001
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/quicknotes
NODE_ENV=development
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

### Pokretanje

#### Development način

1. Pokretanje servera:
   ```bash
   cd server
   npm run dev
   ```

2. Pokretanje client-a (u novom terminalu):
   ```bash
   cd client
   npm start
   ```

#### Production način

1. Build client-a:
   ```bash
   cd client
   npm run build
   ```

2. Build servera:
   ```bash
   cd server
   npm run build
   ```

3. Pokretanje servera:
   ```bash
   npm start
   ```


## API endpoints

### Autentikacija

- `GET /api/auth/google` - Inicijalizacija Google OAuth autentikacije
- `GET /api/auth/google/callback` - Povratni poziv za Google OAuth
- `GET /api/auth/current-user` - Dohvaćanje trenutnog korisnika
- `GET /api/auth/logout` - Odjava korisnika

### Bilješke

- `GET /api/notes` - Dohvaćanje svih bilješki trenutnog korisnika
- `GET /api/notes/get/:id` - Dohvaćanje bilješke prema ID-u
- `POST /api/notes/new` - Kreiranje nove bilješke
- `PUT /api/notes/:id` - Ažuriranje bilješke
- `DELETE /api/notes/:id` - Brisanje bilješke

## Autentikacija

Aplikacija koristi Google OAuth 2.0 za autentikaciju korisnika. Za implementaciju je korišten Passport.js s passport-google-oauth20 strategijom.

### Tijek autentikacije

1. Korisnik klikne "Prijavi se s Google" gumb na Login stranici
2. Korisnik se preusmjerava na Google za autentikaciju
3. Nakon uspješne autentikacije, Google preusmjerava korisnika natrag na aplikaciju
4. Aplikacija stvara sesiju za korisnika
5. Korisnik se preusmjerava na stranicu s bilješkama

## Upravljanje bilješkama

### Kreiranje bilješke

Korisnik može stvoriti novu bilješku s naslovom, sadržajem i odabranom bojom pozadine.

### Uređivanje bilješke

Korisnik može urediti postojeću bilješku, uključujući naslov, sadržaj i boju pozadine.

### Brisanje bilješke

Korisnik može izbrisati bilješku klikom na gumb za brisanje.

### Filtriranje bilješki

Korisnik može filtrirati bilješke prema bojama za lakše pronalaženje.

