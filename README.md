# Dietura - The Diet Planner Web App

A web-based diet planner designed to help users track their meals, monitor their nutrition intake, and achieve their fitness goals. Users can plan their meals for the week, track their daily calorie and protein intake, and visualize progress through easy-to-use dashboards.

## Features
- **Dashboard:** See your daily nutrition goals, progress, and meal summary at a glance.
- **Meal Planner:** Plan your meals for the week and set daily calorie/protein targets.
- **Nutrition Tracker:** Log meals, track calories and macros, and get instant feedback using real food data from trusted APIs.

## Tech Stack
- **Frontend:** React (Vite), React Router, Supabase JS, HTML/CSS
- **Backend:** Node.js, Express, Supabase JS
- **Database & Auth:** Supabase
- **APIs:** Open Food Facts, USDA FoodData Central

---

## Project Structure

```
Diet-Planner/
├── backend/           # Node.js/Express API and Supabase integration
│   ├── middleware/
│   ├── routes/
│   ├── index.js
│   └── ...
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── services/
│   ├── App.jsx
│   ├── index.html
│   └── ...
├── .gitignore
├── README.md
└── ...
```
- `backend/` contains all server-side code and API routes.
- `frontend/` contains all client-side code and UI components.

---

## Quick Start

1. **Clone the repo**  
   `git clone https://github.com/your-username/Diet-Planner.git`

2. **Backend**
   ```
   cd backend
   npm install
   npm start
   ```

3. **Frontend**
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Contributing

To get started:

1. Fork this repository.
2. Clone your fork:  
   `git clone https://github.com/your-username/Diet-Planner.git`
3. Create a new branch for your feature or bugfix:  
   `git checkout -b my-feature`
4. Make your changes and commit them:  
   `git commit -m "Add my feature"`
5. Push to your fork:  
   `git push origin my-feature`
6. Open a Pull Request describing your changes.





