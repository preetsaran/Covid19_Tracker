import React, { useState,useEffect } from 'react';
import './style/App.scss';
import axios from 'axios';
import stateCodes from './constants/stateCodes';
import { MenuItem, FormControl, Select, CardContent,Card } from "@material-ui/core";
import InfoCard from './components/InfoCards';
import sortData from './utilites/utils'
import Table from './components/Table';
import Graph from './components/Graph';

 
function App() {

  const [states, setStates] = useState([]);
  const [currentState, setcurrentState] = useState("India");
  const [currentStateData, setcurrentStateData] = useState({});
  const [statesData, setstatesdata] = useState([]);
  const [casesType, setCasesType] = useState("Confirmed");
  const [Mode, setMode] = useState("star_border");
  const [background, setbackground] = useState("#f5f5fa");


  useEffect( () => {

    const fetch = async () => {
      setStates(stateCodes);
      let res = await axios.get('/statewiseData');
      let sortedData = sortData(res.data.data);

      sortedData.splice(sortedData.length - 2, 1); // removing unknown State
      setstatesdata(sortedData);
      setcurrentStateData(res.data.data[0]);
    }

  fetch();

  }, []) 
  
  useEffect(() => {

    if (statesData.length === 0)
      return;
    
    let cState = currentState === 'India' ? 'Total' : currentState;

    let data = statesData.filter((state) => {
      return (state.state === cState)
    })

    setcurrentStateData(data[0]); 

  },[currentState,statesData])


  const handleState = (e) => {
    
    if (e.target.value === 'India') {
      setcurrentState('India');
      e.target.value = 'Total';
    }
    else {
      setcurrentState(e.target.value)
    }

    let data = statesData.filter((state) => {
      return (state.state === e.target.value)
    })

    setcurrentStateData(data[0]); 

  }
  
  const handleMode = () => {

    if(Mode === "star_half"){
      setMode("star");
      setbackground("#161625");
    }
    else if (Mode === "star_border") {
      setMode("star_half");
      setbackground("rgb(8 1 41 / 44%)");
    }
    else if(Mode === "star"){
      setMode("star_border");
      setbackground("#f5f5fa");
    }
    
  }

 
  return (
    <div className="App"  style={{backgroundColor:background}}>
      
      <div className="app__left">
        
        <div className="app_header" >
          <h1>
            <span style={{ color: "rgb(156 0 0)" }}>Covid19 </span>
            <span style={{ color: "#4c75f2" }}>Tracker</span> </h1>
         
          <i className="material-icons"
            style={{  color: (Mode === "star" ? "Red" : "black")}}
            onClick={handleMode}> {Mode}
          </i>
          
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={currentState} onChange={handleState} style={{color: "#4c75f2"}}>
            <MenuItem value="India" key="IND" > India </MenuItem>
              {states.map((obj) => {
                let key = Object.keys(obj)[0];
                return <MenuItem value={obj[key]} key={key}> {obj[key] }</MenuItem>
              })}
            </Select>
          </FormControl>

        </div>

        <div className="app_stats" >
          
          <InfoCard
            handleCasesType={()=>{setCasesType("Confirmed")}}
              title="Confirmed Cases"
              cases={(currentStateData.deltaconfirmed)}
              total={(currentStateData.confirmed)}
            background={background}
            
          />
          
          <InfoCard
            handleCasesType={()=>{setCasesType("Active")}}
            title="Active Cases"
            cases={(currentStateData.active)}
            background={background}
            total={(currentStateData.confirmed)}
          />
          
          <InfoCard
            handleCasesType={()=>{setCasesType("Recovered")}}
            title="Recovered"
            cases={(currentStateData.deltarecovered)}
            total={(currentStateData.recovered)}
            background={background}
          />
          
          <InfoCard
            handleCasesType={() => {setCasesType("Deaths") }}
            title="Deaths"
            cases={(currentStateData.deltadeaths)}
            total={(currentStateData.deaths)}
            background={background}
          />
          
        </div>
          
        <h3 className='graph_heading'>{currentState} {casesType}</h3>
          <Graph
            casesType={casesType}
            currentState={currentState}
          />
      </div>

      <Card className="app__right" style={{background:background}}>

        <CardContent>
          <div className="app__information">

            <h3 className="table_heading">Live Cases by States</h3>
            <Table
              states={statesData}
              background={background}
              handleState={handleState}
              setcurrentState={setcurrentState}

            /> 
          </div>
        </CardContent>
            
      </Card>
              
    
    </div>
  );
}

export default App;
