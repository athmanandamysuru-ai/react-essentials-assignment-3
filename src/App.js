import React, { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("Bangalore");

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`,
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city) {
        fetchWeather();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [city]);

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <h1>Weather Dashboard</h1>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={fetchWeather}>Get Weather</button>

      <div>
        {loading && <p>Loading weather data...</p>}

        {error && <p>{error}</p>}

        {weather && (
          <div>
            <p>
              Temperature:
              {weather.main.temp}°C
            </p>

            <p>
              Condition:
              {weather.weather[0].main}
            </p>

            <p>
              Humidity:
              {weather.main.humidity}%
            </p>

            <p>
              Wind:
              {weather.wind.speed}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
