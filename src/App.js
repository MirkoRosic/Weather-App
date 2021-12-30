import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import { API_URL, API_KEY } from "./config.js";
import Weather from "./components/weather";
import { BiCurrentLocation } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

function App() {
  const [lat, setlat] = useState("");
  const [long, setLong] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState("");

  const inputContainer = useRef(null);

  const getCityName = async () => {
    await fetch(`${API_URL}/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`)
      .then((res) => res.json())
      .then((result) => {
        setCity(result.name);
        setImage(result.weather[0].main);
      })
      .catch((error) => {});
  };

  async function closestToMe() {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        setlat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    } catch (error) {
      alert(
        "Something went wrong. Check your location settings and internet connection and try again."
      );
    }
  }

  async function getCityCoords(e) {
    if (e.type === "click" || e.charCode === 13) {
      try {
        await fetch(
          `${API_URL}/weather?q=${inputContainer.current.value}&APPID=${API_KEY}`
        )
          .then((res) => res.json())
          .then((result) => {
            setlat(result.coord.lat);
            setLong(result.coord.lon);
          });
      } catch (error) {
        alert(
          "Something went wrong. Please check your internet connection or your input and try again."
        );
      }
    }
  }

  useEffect(() => {
    closestToMe();
  }, []);

  useEffect(() => {
    getCityName();
  }, [long]);

  return (
    <>
      <header>
        <button type="button" className="second" onClick={closestToMe}>
          Use my location <BiCurrentLocation />
        </button>
        <div className="search__container">
          <input
            type="text"
            ref={inputContainer}
            placeholder="Check weather in..."
            onKeyPress={getCityCoords}
          />
          <button type="button" onClick={getCityCoords}>
            <FaSearch />
          </button>
        </div>
      </header>
      <main className={`App ${image}`}>
        {lat && long && <Weather city={city} lat={lat} long={long} />}
      </main>
    </>
  );
}

export default App;
