var validate = function() {
  var input_value = document.getElementById("city_five").value;
  if (input_value.length <= 1) {
    document.getElementById("prompt_five").style.display = "block";
  } else {
    document.getElementById("prompt_five").style.display = "none";
    document.getElementById("prompt_city").style.display = "none";
    myfunction(input_value);
  }
};

/*
var deg_to_compass = function (evt) { // calculate deg to cardinal direction
  var val = Math.floor((evt / 45) + 0.6);
  var arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return arr[(val % 8)];
};
*/
var day_of_the_week = function(evt) {
  var input_date = new Date(evt);
  var output_day = input_date.getDay();
  return {
    //  day: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'][output_day], //returns readable day of the week
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][output_day],
    color: output_day //returns day number
  };
};

//zaokrąglanie opadów
/*
var round_value_snow_rain = function (evt) {  // round value
  if(evt >= 1){
    return Math.round(evt);
  } else {
    return 0;
  }
};
*/
var round_value = function(evt) {
  // round value
  return (Math.round(evt * 4) / 4).toFixed(2);
};

var rainVolume = function(response_object, i) {
  var isEmpty = response_object.list[i].rain;
  if (isEmpty) {
    if (Object.keys(isEmpty).length === 0) {
      return 0;
    } else {
      return round_value(response_object.list[i].rain["3h"]);
    }
  } else {
    return 0;
  }
};

var snowVolume = function(response_object, i) {
  var isEmpty = response_object.list[i].snow;
  if (isEmpty) {
    if (Object.keys(isEmpty).length === 0) {
      return 0;
    } else {
      return round_value(response_object.list[i].snow["3h"]);
    }
  } else {
    return 0;
  }
};

var myfunction = function(input_value) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?q=${input_value}&lang=pl&units=metric&APPID=27934ae1bf6fc9febb5efe59f95f74f6`
  );
  xhr.send(null);
  xhr.addEventListener("load", function() {
    if (xhr.status === 200) {
      document.getElementById("prompt_city").style.display = "none";
      var response_object = JSON.parse(xhr.responseText);

      var newTime = [];
      var newTemp = [];
      var newPress = [];
      var newTime = [];
      var newDay = [];
      var newRain = [];
      var newSnow = [];
      var newSpeed = [];
      //  var newDegrees = [];

      for (var i = 0; i < response_object.list.length; i++) {
        var time = response_object.list[i].dt_txt; // time
        var temp = response_object.list[i].main.temp; //temperature
        var pressure = response_object.list[i].main.pressure; // pressure
        var result = day_of_the_week(time); // function day_of_the_week returns object
        var windSpeed = response_object.list[i].wind.speed; // wind
        //  var windDegrees = response_object.list[i].wind.deg; // degrees

        //  newTime.push(time.slice(11, 16));
        newTemp.push(round_value(temp));
        newPress.push(round_value(pressure));
        newTime.push(time.slice(11, 13));
        newDay.push(result.day);
        newRain.push(rainVolume(response_object, i));
        newSnow.push(snowVolume(response_object, i));
        newSpeed.push(round_value(windSpeed));
        //  newDegrees.push(windDegrees);
      }

      Chart.defaults.global.defaultFontColor = "white";
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.animation.duration = 1000;
      Chart.defaults.global.legend.labels.fontSize = 15;
      //   Chart.defaults.global.animation.easing = 'easeOutBack';

      var ctx = document.getElementById("myChart").getContext("2d");
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "bar",
        // The data for our dataset
        data: {
          datasets: [
            {
              type: "line",
              data: newTemp,
              label: "Temperature",
              borderColor: "red",
              borderWidth: 2,
              yAxisID: "left-y-axis"
            },
            {
              data: newRain,
              label: "Rainfall",
              borderColor: "blue",
              backgroundColor: "blue",
              borderWidth: 1,
              yAxisID: "right-y-axis"
            },
            {
              data: newSnow,
              label: "Snowfall",
              borderColor: "yellow",
              backgroundColor: "yellow",
              borderWidth: 1,
              yAxisID: "right-y-axis"
            }
          ],
          labels: newDay
        },

        // Configuration options go here
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                },
                id: "left-y-axis",
                type: "linear",
                position: "left",
                scaleLabel: {
                  display: true,
                  labelString: "Temperature - \u{02103}",
                  fontSize: 20
                }
              },
              {
                ticks: {
                  max: 10,
                  min: 0,
                  stepSize: 1
                },
                gridLines: {
                  display: false
                },
                id: "right-y-axis",
                position: "right",
                scaleLabel: {
                  display: true,
                  labelString: "Rain/Snow - mm",
                  fontSize: 20
                }
              }
            ]
          },
          tooltips: {
            mode: "index",
            backgroundColor: "rgba(56, 176, 222, 0.5)",
            borderColor: "rgba(128, 128, 128, 0.9)",
            borderWidth: 2
          },
          title: {
            //  display: true,
            //  text: 'Pogoda pięciodniowa',
            //  fontColor: 'white',
            //  fontSize: 30,
          }
        }
      });

      var ctx = document.getElementById("myChart2").getContext("2d");
      var chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: newDay,
          datasets: [
            {
              data: newPress,
              label: "Pressure",
              borderColor: "magenta",
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Pressure - hPa",
                  fontSize: 20
                }
              }
            ]
          },
          tooltips: {
            backgroundColor: "rgba(56, 176, 222, 0.5)",
            borderColor: "rgba(128, 128, 128, 0.9)",
            borderWidth: 2
          },
          legend: {
            labels: {
              fontSize: 15
            }
          }
        }
      });

      var ctx = document.getElementById("myChart3").getContext("2d");
      var chart = new Chart(ctx, {
        type: "bar",
        data: {
          datasets: [
            {
              label: "Wind speed",
              data: newSpeed,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1
            }
          ],
          labels: newDay
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Wind speed - m/s",
                  fontSize: 20
                },
                ticks: {
                  fontSize: 15,
                  suggestedMax: 30
                }
              }
            ]
          }
        }
      });
    } else if (xhr.status === 404) {
      document.getElementById("prompt_city").style.display = "block";
    } else {
      console.log("serwer nie odpowiada");
    }
  });
};
