# U.S. Electricity Generation Visualization (1950-2023)

An interactive visualization of historical U.S. electricity generation data across major energy sources, built with Next.js and Recharts.

## 🔗 Live Demo

Check out the live demo: [https://power-map.vercel.app](https://power-map.vercel.app)

## 📊 Features

- Interactive line chart visualization
- Data from 1950 to 2023
- Major energy sources tracked:
  - Coal
  - Natural Gas
  - Nuclear
  - Renewables
  - Petroleum
- Interactive tooltips with precise values
- Download chart as PNG functionality
- Responsive design with dark/light mode support

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Visualization:** Recharts
- **Styling:** Tailwind CSS
- **Typography:** Geist Font
- **Language:** TypeScript

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/power-map.git
cd power-map
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Data Source

The electricity generation data is sourced from the U.S. Energy Information Administration (EIA), covering annual statistics from 1950 to 2023. All measurements are in billion kilowatthours.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 📄 License

MIT License