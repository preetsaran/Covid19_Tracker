const fs = require("fs");
const axios = require('axios');

const getStateWiseData = async (req, res) => {

    try {

        
        let data = await fs.promises.readFile('./Data_Files/stateWise.json');
        
        data = JSON.parse(data);

        res.status(200).json({
            data
        })

    } catch (error) {
        console.log(error); // Todo :- handle errors also
    }

}

const getTimeSeriesData =  async (req, res) => {

    try {

        let state = req.params.state; 

        let chartData = await fs.promises.readFile('./Data_Files/stateTimeSeries.json');

        chartData = JSON.parse(chartData);

        chartData = chartData[state] ? chartData[state].dates : chartData["AN"];
        var keys = Object.keys(chartData);

        let data = [];
        
        for (let i = 128; i < keys.length; i++){
             
            let deathsNotAvailbale =    data[data.length - 1] &&  data[data.length - 1].Deaths ? data[data.length - 1].Deaths   : 1;
            let recoveredNotAvailbale = data[data.length - 1] &&  data[data.length - 1].Recovered ? data[data.length - 1].Recovered : 1;
            let confirmedNotAvailbale = data[data.length - 1] &&  data[data.length - 1].Confirmed ? data[data.length - 1].Confirmed : 1;

            let Deaths = (chartData[keys[i]].delta != undefined && chartData[keys[i]].delta.deceased !== undefined) ? Number(chartData[keys[i]].delta.deceased) : deathsNotAvailbale;
            let Recovered = (chartData[keys[i]].delta != undefined && chartData[keys[i]].delta.recovered !== undefined) ? Number(chartData[keys[i]].delta.recovered) : recoveredNotAvailbale;
            let Confirmed = (chartData[keys[i]].delta != undefined && chartData[keys[i]].delta.confirmed !== undefined) ? Number(chartData[keys[i]].delta.confirmed) : confirmedNotAvailbale;
            
            data.push({
                "Date" : keys[i],
                "Deaths"    : Deaths ,
                "Recovered" : Recovered ,
                "Confirmed" :  Confirmed
            })
        }
        

        res.status(200).json({
            data
        })

    } catch (error) {
        console.log(error); // Todo :- handle errors also
    }

}

const getOverAllTimeSeries =   async (req, res) => {

    try {

        let chartData = await fs.promises.readFile('./Data_Files/overAllTimeSeries.json');
        chartData = JSON.parse(chartData);

        let data = [];
        
        for (let i = 1; i < chartData.length; i++){
    
            let date = new Date(chartData[i].dateymd) ;
            
            data.push({
                "Date" : date,
                "Deaths" : Number(chartData[i].totaldeceased) -  Number(chartData[i-1].totaldeceased),
                "Recovered" : Number(chartData[i].totalrecovered) -  Number(chartData[i-1].totalrecovered),
                "Confirmed" : Number(chartData[i].totalconfirmed) -  Number(chartData[i-1].totalconfirmed),
            })
        }   



        res.status(200).json({
            data
        })

    } catch (error) {
        console.log(error); // Todo :- handle errors also
    }

}

module.exports.getStateWiseData = getStateWiseData;
module.exports.getTimeSeriesData = getTimeSeriesData;
module.exports.getOverAllTimeSeries = getOverAllTimeSeries;