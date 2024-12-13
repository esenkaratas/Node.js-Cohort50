import express from "express";
import keys from "./sources/keys.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.get("/", (req, res) => {
  res.send("Hello from backend to frontend!");
});

app.post("/weather", async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: "There is no city name" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${keys.API_KEY}`;
    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    if (response.status === 404 || weatherData.cod === "404") {
      return res.status(404).json({ weatherText: "City is not found!" });
    }

    if (response.ok) {
      const temperature = weatherData.main.temp;
      const name = weatherData.name;
      return res.status(200).json({
        weatherText: `The weather in ${name} is currently ${temperature}°C.`,
      });
    }

    return res.status(400).json({ error: "Failed to fetch weather data" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
});

export default app;
