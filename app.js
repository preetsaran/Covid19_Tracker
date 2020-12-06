const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const fs = require("fs");
const axios = require('axios');
const { getStateWiseData, getTimeSeriesData ,getOverAllTimeSeries} = require('./controllers/controller');


async function getAllStatesData() {

    let response = await axios.get('https://api.covid19india.org/data.json');

    let statewiseData = response.data.statewise;
        statewiseData = JSON.stringify(statewiseData);

    let overAllTimeSeries = response.data.cases_time_series;
    overAllTimeSeries = JSON.stringify(overAllTimeSeries);
    
    await fs.promises.writeFile('./Data_Files/stateWise.json', statewiseData);

    await fs.promises.writeFile('./Data_Files/overAllTimeSeries.json', overAllTimeSeries);
}

async function getRecordSeries() {

    let response = await axios.get('https://api.covid19india.org/v4/timeseries.json');
    
    data = response.data;

    data = JSON.stringify(data);

    await fs.promises.writeFile('./Data_Files/stateTimeSeries.json', data);

}

setTimeout( () => {  
    getAllStatesData();
    getRecordSeries();
}, 1000 * 3600 * 4);


app.get('/statewiseData', getStateWiseData)

app.get('/timeseries/:state',getTimeSeriesData)

app.get('/overAllTimeSeries', getOverAllTimeSeries)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('covid-tracker/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'covid-tracker','build','index.html'))
    })
}

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});