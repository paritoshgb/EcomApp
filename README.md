# EcomApp

A fully functional React Native **E-Commerce app** prototype built using the FakeStore API. It offers product browsing, detail view, cart, dummy checkout, offline support, and persistent favorites.

## ✨ Features

- 🖼️ **Home Screen**
  - Static Category & banners slider
  - Product list (API-based)
  - Shimmer Placeholder while loading
- 🛍️ **Product Listing**

  - product list using `FlatList`
  - Search bar with **server-side filtering**
  - Filters & Sorting options
  - Shimmer Placeholder while loading

- 📦 **Product Detail Page**

  - Product Image, Title, Price, Description
  - Add to Cart (with badge count in tab)
  - Mark/Unmark as Favorite (AsyncStorage)

- 🛒 **Cart**

  - View all cart items
  - Increase/Decrease quantity (live total update)
  - Remove items or clear cart
  - Persistent using Redux-Persist

- 🧾 **Checkout**

  - Dummy shipping address & coupon code
  - `ESHOP10` coupon applies 10% discount
  - $5 fixed shipping charge
  - Final amount summary
  - Confirmation toast and clear cart on place order

- 🌗 **Dark Mode** using system color scheme

- 🧭 **Navigation**
  - Splash Screen (shown once)
  - Get Started Animation Screen
  - Bottom Tab Navigator:
    - Home
    - Products
    - Favorites (with badge count)
    - Cart (with badge count)

---

## 🛠 Tech Stack

- React Native CLI
- React Navigation
- Axios
- Redux + Redux Persist
- AsyncStorage
- Shimmer Placeholder
- Vector Icons
- FakeStore API

## 🧪 Test Credentials & Notes

- Coupon Code: ESHOP10 → applies 10% off
- Shipping Charge: $5 (added automatically)

---

## 📁 Folder Structure

├── src/
│ ├── api/ # Axios logic
│ ├── Images/ # Images & splash assets
│ ├── components/ # Common reusable UI
│ ├── screens/ # All app screens
│ ├── redux/ # Redux store & reducers
│ └── utils/ # Theme & helper hooks
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
git clone https://github.com/paritoshgb/EcomApp.git
cd EComApp

***📬 Contact
Developed by Paritosh Sharma
This project was created for interview evaluation only.

***📝 License
This project is licensed under MIT.
Uses public API from https://fakestoreapi.com

***🙏 Special Thanks
ABHIWAN TECHNOLOGY for the opportunity

```
