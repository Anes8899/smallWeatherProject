import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [data, setData] = useState(null);
  const [query, setquery] = useState();
  const [change, setChange] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = "b842550631e2613db7368cdb4f803135";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  const location = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${API_KEY}`;

  function handleRefresh() {
    setquery(data.name);
  }

  function getCurrentDate(separator = "/") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const newDate = new Date();

    return `${WeekDays[newDate.getDate() - 1]} ${newDate.getDate()} ${
      months[newDate.getMonth()]
    }`;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(""); // Clear any previous errors
      try {
        const url = query
          ? `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`
          : location;

        const res = await fetch(url);
        const dataJson = await res.json();
        if (!res.ok) {
          throw new Error("Network response was not found");
        }
        if (!dataJson) {
          console.log("not found");
          setError("Not found");
        } else {
          setData(dataJson);
        }
        console.log(dataJson);
      } catch (error) {
        console.log(error.message + " data");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if ((position.latitude && position.longitude) || query) {
      fetchData();
    }
  }, [query, position, location]);

  console.log(query);

  function handleChange(e) {
    const city = e.target.value;
    setChange(city);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setquery(change);
    setLoading(true);
    setChange("");
  };

  console.log(data);

  if (error) {
    return (
      <div className="refresh">
        <p>{error}</p>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSearch} className="form">
          <input type="text" onChange={handleChange} value={change} />
          <button type="submit">search</button>
        </form>
        <div className="data">
          {loading ? (
            <p>Loading...</p>
          ) : (
            data && (
              <>
                <h2>{data.name}</h2>
                <h3> {getCurrentDate()}</h3>
                <div className="temperature">
                  <div className="imgWithTemp">
                    <p> {Math.floor(data.main.temp - 273.15)}°C</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      alt="icon"
                    />
                  </div>
                </div>
                <p>{data.weather[0].description}</p>

                <p>Wind Speed: {data.wind.speed} m/s</p>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
