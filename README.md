# 🧬 Pokedex App (React Native)

A fully featured and enhanced **Pokémon Pokedex App** built using **React Native**, powered by the [PokeAPI](https://pokeapi.co/).  
This application is developed as part of the technical assessment for **Kriscent Techno Hub Pvt Ltd**.

---

## ✨ Features

- 🔁 **Infinite scrolling** with pagination using `FlatList`
- ✨ **Shimmer loading** effect during data fetch
- ❤️ Mark/unmark Pokémon as **Favorites**, stored locally using `AsyncStorage`
- 📜 Favorites are **persisted across app launches**
- 🔍 **Search** Pokémon by name (Server-side filtering)
- 📄 Pokémon **Detail Screen** shows:
  - Image
  - Type(s)
  - Abilities
  - Stats (HP, Attack, Defense, etc.)
- 🎉 **Splash Screen** + **Animated Get Started screen** (only shown once)
- 🌓 **Dark Mode** support using device color scheme detection (optional if forcely used)
- 🔘 **Bottom Tab Navigator** with:
  - Home
  - Favorites (with badge count)
  - Search
- 🔥 **Animations** on favorite toggle & screen transitions
- ✅ Clean & modular code with comments and structure

---

## 🛠 Tech Stack

- React Native
- Axios
- React Navigation
- AsyncStorage
- React Native Vector Icons
- React Native Reanimated
- Shimmer Placeholder
- FlatList (for high performance list rendering)
- Custom Axios wrapper (`getData`, `postData`)

---

## 📦 Folder Structure

pokedexApp/
├── src/
│ ├── components/ # Reusable components like PokemonCard
│ ├── screens/ # All screen files
│ ├── navigation/ # Stack & Tab navigation
│ ├── assets/ # Images, splash icons etc.
│ └── api/ # API logic
├── App.js
├── README.md
└── ...

## 🚀 Setup Instructions

For Android:
npx react-native run-android

For iOS:
npx pod-install
npx react-native run-ios

For Install Dependencies:
npm install

### 📥 Clone the Repository

```bash
git clone https://github.com/paritoshgb/pokedexApp.git
cd pokedexApp

***📬 Contact
Developed by ParitoshSharma
This project was created for interview evaluation only.

***📝 License
This project is licensed under MIT.
Uses public API from https://pokeapi.co

***🙏 Special Thanks
Kriscent Techno Hub Pvt Ltd for the opportunity

PokeAPI for providing free Pokémon data
```
