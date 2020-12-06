import React from 'react'
import { useEffect, useState } from 'react';
import stateCodes from '../constants/stateCodes';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";
import axios from 'axios';  

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            // tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };
  
const buildChartData = (data, casesType) => {

    let chartData = [];

    data.forEach((d) => {

        const newDataPoint = {
            x: d.Date,
            y: (casesType === "Deaths") ? d.Deaths : (casesType === "Recovered") ? d.Recovered : d.Confirmed 
        }
        chartData.push(newDataPoint);
    })

    return chartData;
}


function Graph({ casesType ,currentState  }) {

    const [chartData, setchartData] = useState([]);
    let state = currentState;
    
    if (state !== 'India') {
        
        let d = stateCodes.filter((obj) => {
            let key = Object.keys(obj);
            key = key[0];
            return obj[key] === currentState
        })

        state = Object.keys(d[0])[0];
    }

    let URL = state === 'India' ? '/overAllTimeSeries' : `/timeseries/${state}`
    
  useEffect( () => {

    const fetch = async () => {
      let res = await axios.get(URL);
      setchartData(buildChartData(res.data.data, casesType))
    }
    fetch();
    },[casesType,currentState,URL])
    
    let bgColor = '#ff6b6b';
    let bdColor = 'Red' 

    if (casesType === 'Recovered') {
        bgColor = '#cdf1cd'
        bdColor = 'green'
    }
    else if (casesType === 'Deaths') {
        bgColor = 'rgb(216, 201, 201)'
        bdColor = 'gray'
    }
    else if (casesType === 'Active') {
        bgColor = '#a3bdee'
        bdColor = 'blue'
    }


    return (
            
        <div className="graph" >
            {chartData.length > 0 && (
                <Line
                    data={{
                        datasets: [{
                            data: chartData,
                            backgroundColor: bgColor,
                            borderColor: bdColor
                        }]
                    }}
                    options={options}
                />)} 
        </div>
    )
}
  
export default Graph
