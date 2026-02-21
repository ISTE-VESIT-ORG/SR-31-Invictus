# Celestia 
# SR -31 

**Celestia** is a next-generation interactive space education and exploration platform. It combines real-time data from NASA, advanced 3D visualizations, and AI-powered explanations to make the cosmos accessible to everyone—from curious kids to serious stargazers.

## Why Celestia?

Unlike static websites, Celestia is **alive**. It connects to over 10 different real-time APIs to show you what's happening in space *right now*.

### Key Features
- ** AI Space Tutor**: Ask any question, and our Gemini-powered AI explains it simply with fun facts.
- ** Stargazing Forecast (ML)**: A machine learning model analyzes your local weather, moon phase, and light pollution to predict tonight's visibility.
- ** Live Satellite Tracker**: Track the ISS and other satellites in real-time with SGP4 orbit propagation.
- ** Earth Watch**: Monitor natural disasters (wildfires, storms) and climate data live from space.
- ** Cosmos Guide**: Interactive guides to constellations, meteor showers, and comets.
- ** PWA Support**: Installable as a native app with push notifications for celestial events.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Visualizations**: [Three.js](https://threejs.org/) (`@react-three/fiber`), [Leaflet](https://leafletjs.com/) (Maps)
- **Styling**: CSS Modules, Framer Motion (Animations)

### Backend (ML & AI)
- **Server**: Flask (Python)
- **AI**: Google Gemini (Generative AI)
- **ML**: Scikit-Learn (Visibility Prediction Model)
- **Scheduler**: APScheduler (Daily Event Scanning)

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/celestia.git
cd celestia
```

### 2. Frontend Setup
Install the JavaScript dependencies:
```bash
npm install
```

### 3. Backend Setup
Install the Python dependencies for the AI/ML features:
```bash
pip install -r ml/requirements.txt
```

### 4. Environment Keys (`.env.local`)
Create a `.env.local` file in the **root directory** and add the following keys:

```ini
# NASA Data (APOD, EONET, EPIC, Mars Rovers)
NASA_API_KEY=your_nasa_api_key

# Satellite Tracking (N2YO)
N2YL_API_KEY=your_n2yo_api_key

# AI Explainer (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Push Notifications (Generate via `npx web-push generate-vapid-keys`)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 5. Run the Application

**Step A: Start the Frontend**
```bash
npm run dev
```
*Access the app at `http://localhost:3000`*

**Step B: Start the Backend (in a new terminal)**
```bash
python ml/app.py
```
*The Flask server runs on port 5000 to handle ML/AI requests.*

---

## Project Structure

```
celestia/
├── src/
│   ├── app/              # Next.js App Router Pages
│   ├── components/       # Reusable React Components
│   ├── data/             # Static Data (Events, Missions)
│   └── api/              # Internal API Proxies
├── ml/
│   ├── app.py            # Flask Entry Point
│   ├── clarity/          # ML Visibility Model
│   ├── explainer/        # Gemini AI Logic
│   └── scheduler/        # Daily Event Scanner
├── public/               # Static Assets
└── package.json          # Frontend Dependencies
```

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is open-source and available under the MIT License.
