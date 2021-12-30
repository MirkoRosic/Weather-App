import React, { useEffect, useState, memo } from "react";
import { API_URL, API_KEY, ICON_URL } from "../config";

const Weather = ({ lat, long, city }) => {
  const [data, setData] = useState(null);

  const getData = async () => {
    await fetch(
      `${API_URL}/onecall?lat=${lat}&lon=${long}&units=metric&APPID=${API_KEY}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  };

  function timeConverter(time) {
    const ms = time * 1000;
    const date = new Date(ms).toLocaleTimeString();

    let hours = JSON.stringify(date).split(":")[0].slice(1);
    if (JSON.stringify(date).split(":")[2].slice(-3).slice(0, -1) === "PM") {
      hours = +hours + 12 + ":00";
    } else hours = +hours + ":00";
    return hours;
  }

  function dayConverter(time, full = false) {
    const ms = time * 1000;
    const date = new Date(ms).getDay();
    let numberDate;
    numberDate = JSON.stringify(new Date(ms)).split("-")[2].slice(0, 2);
    let day = "";

    switch (date) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        day = "";
    }
    if (full === true) return day + " " + numberDate;
    else return day;
  }

  useEffect(() => {
    getData();
  }, [city]);

  if (data === null) {
    return <div></div>;
  } else
    return (
      <>
        <section className="current">
          <div className="current__weather">
            <p className="current__temp">
              {Math.round(data.current.temp)}&deg;{" "}
            </p>
            <div className="current__location">
              <p className="current__city">{city} </p>
              <p className="current__date">
                {dayConverter(data.current.dt, true)}, Feels like
                {" " + Math.round(data.current.feels_like)}&deg;C
              </p>
            </div>

            <div className="current__description">
              <img
                src={`${ICON_URL}/${data.current.weather[0].icon}@2x.png`}
                alt={`${data.current.weather[0].main} icon`}
              />
              <p className="current__descr">{data.current.weather[0].main}</p>
            </div>
          </div>

          <div className="current__hours">
            {data.hourly.map((hour, i) => {
              if (i < 8) {
                return (
                  <article key={i} className="current__hour">
                    <h5>{timeConverter(hour.dt)}</h5>
                    <img
                      src={`${ICON_URL}/${hour.weather[0].icon}@2x.png`}
                      alt={`${data.current.weather[0].main} icon`}
                    />
                    <p>{Math.round(hour.temp)}&deg;</p>
                  </article>
                );
              }
              return null;
            })}
          </div>
        </section>

        <section className="details">
          <article className="details__weather">
            <h4>Weather details</h4>
            <div className="details__container">
              <div className="details__item">
                <p>Cloudiness</p>
                <p>{data.current.clouds}%</p>
              </div>

              <div className="details__item">
                <p>Humidity</p>
                <p>{data.current.humidity}%</p>
              </div>

              <div className="details__item">
                <p>UV Index</p>
                <p>{data.current.uvi}</p>
              </div>

              <div className="details__item">
                <p>Visibility</p>
                <p>{data.current.visibility}m</p>
              </div>

              <div className="details__item">
                <p>Air Pressure</p>
                <p>{data.current.pressure}hPa</p>
              </div>
            </div>
          </article>

          <article className="details__weather">
            <h4>7 Day Forecast</h4>
            <div className="details__container">
              <div className="details__item">
                <p>Today</p>
                <p>{Math.round(data.current.temp)}&deg; </p>
              </div>

              {data.daily.map((day, i) => {
                if (i > 0) {
                  return (
                    <div key={day.dt} className="details__item">
                      <p>{dayConverter(day.dt)}</p>
                      <p>{Math.round(day.temp.day)}&deg; </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </article>
        </section>
      </>
    );
};

export default memo(Weather);
