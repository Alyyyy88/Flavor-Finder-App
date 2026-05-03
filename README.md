# FlavorFinder — Angular Recipe App (Spoonacular API)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a FREE Spoonacular API Key
1. Go to https://spoonacular.com/food-api
2. Click "Start for Free" and create an account
3. Copy your API key from the dashboard (free tier = 150 req/day)

### 3. Add your API key to the app
Open this file:
```
src/app/services/recipe.service.ts
```
Find this line near the top:
```ts
const SPOONACULAR_API_KEY = 'YOUR_SPOONACULAR_API_KEY';
```
Replace `YOUR_SPOONACULAR_API_KEY` with your actual key.

---

## Running the app

```bash
ng serve
```
Then open: **http://localhost:4200**

> No proxy server needed — Spoonacular supports browser requests directly.

---

## Features
- 🔍 Search by ingredient with RxJS `switchMap` (no race conditions)
- 🖼 Real food photos from Spoonacular with lazy loading
- 🃏 Instagram-style recipe grid with staggered animations
- 🪟 Angular Material Dialog for full recipe details
- 🧮 Custom `gramsToOunces` pipe with metric/imperial toggle
- 🛒 Global shopping list (Angular Signals) with slide-out drawer
- ❤️ Save to favorites per card
- 🔄 Filter chips: All / Under 30 min / Vegetarian / Healthy
