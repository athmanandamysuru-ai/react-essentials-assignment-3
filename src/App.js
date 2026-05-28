import React, { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");

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
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchWeather();
  // }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) fetchWeather();
  };

  const handleClear = () => {
    setCity(""); 
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
      </header>

      <main className="container">
        <form className="search" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City"
          />
          <button 
          onClick={handleClear}
          style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
        >
          ✕
        </button>

          {/* <button className="btn" type="submit">
            Get Weather
          </button> */}
        </form>

        {city ? (
          <section className="results">
            {loading && <p className="muted">Loading weather data…</p>}

            {error && <p className="error">{error}</p>}

            {weather && (
              <div className="weather-card">
                <div className="weather-main">
                  <h2 className="city-name">{weather.name}</h2>
                  <div className="temp">{Math.round(weather.main.temp)}°C</div>
                  <div className="condition">
                    {weather.weather[0].description}
                  </div>
                </div>

                <div className="weather-details">
                  <div className="detail">
                    <span className="label">Humidity💦</span>
                    <strong>{weather.main.humidity}%</strong>
                  </div>

                  <div className="detail">
                    <span className="label">Wind💨</span>
                    <strong>{weather.wind.speed} m/s</strong>
                  </div>

                  <div className="detail">
                    <span className="label">Sunrise🌅</span>
                    <strong>
                      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </strong>
                  </div>
                  <div className="detail">
                    <span className="label">Sunset🌇</span>
                    <strong>
                      {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </strong>
                  </div>
                  <div className="detail">
                    <span className="label">Max Temp🥵</span>
                    <strong>{Math.round(weather.main.temp_max)}°C</strong>
                  </div>
                  <div className="detail">
                    <span className="label">Min Temp🥶</span>
                    <strong>{Math.round(weather.main.temp_min)}°C</strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (<div>
          <p className="muted">Please enter the city to get realtime weather update.</p>
        </div>)}
      </main>
    </div>
  );
}

export default App;
