# Dietura - The Diet Planner Web App

A web-based diet planner designed to help users track their meals, monitor their nutrition intake, and achieve their fitness goals. Users can plan their meals for the week, track their daily calorie and protein intake, and visualize progress through easy-to-use dashboards.

## Features

### 1. **Dashboard**
- Displays daily nutrition goals, progress bars, and summary of calories and protein intake for the day.
- Allows users to track their progress against long-term goals like weight loss or muscle gain.
- Visualizes consumed meals and nutrient intake throughout the day.

### 2. **Meal Planner**
- Allows users to plan their meals for the week.
- Users can select meals, adjust portions, and set daily calorie and protein goals.
- Displays planned meals for each day and helps users stick to their diet plan.

### 3. **Nutrition Tracker**
- Users can log their meals each day and track their nutritional intake (calories, protein, fats, etc.).
- Provides real-time updates on consumed nutrients and compares them with the user's goals.
- Offers detailed food data sourced from reliable APIs.

### 4. **Recipe Library**
- Provides a library of recipes that users can browse through.
- Each recipe includes detailed nutritional information for each ingredient.

---

## Tech Stack

### Frontend:
- **React**: A JavaScript library for building the user interface.
- **Material UI**: A popular React component library for building modern, responsive UI components.
- **HTML/CSS**: For web structure and styling.

### Backend:
- **Node.js**: JavaScript runtime for the backend server.
- **Express.js**: Web framework for Node.js for handling API requests.

### Database:
- **MongoDB**: NoSQL database to store user data, meal plans, logs, and recipes.

### APIs:
1. **Open Food Facts API**
   - Provides food data, including nutritional information for various foods.
   - Helps track calories, protein, and other nutrients for user meals.
   - Completely open-source and free to use.

   [Open Food Facts API Documentation](https://world.openfoodfacts.org/data)

2. **FoodData Central (USDA) API**
   - Provides detailed nutritional data for thousands of food items.
   - Supports tracking of calories, macronutrients, and micronutrients.
   - Free access for public use.

   [FoodData Central API Documentation](https://fdc.nal.usda.gov/api-key-signup.html)

---


