import React from 'react'
import '../style/infoCards.scss';
import { Card, CardContent, Typography } from '@material-ui/core'


function InfoCard({ title, cases, total , background,handleCasesType }) {

    let color = "Red";

    if (title === "Recovered") {
        color = "#44d644";
    }
    else if (title === "Active Cases") {
        color = "#4c75f2";
    }
    else if (title === "Confirmed Cases") {
        background = "rgba(255,7,58,.12549)";
    }
    else if (title === "Deaths") {
        color = "#b69696";
    }

    return (
        <Card
            className='infoCard'
            style={{ background: background, color: color }}
            onMouseOver={handleCasesType}
        >
            <CardContent className={title}>

                <Typography color="textSecondary" style={{color:color}} gutterBottom >
                    {title}
                </Typography>

                <h2 className="infoCard__cases" style={{color:color}} >
                    {title === "Active Cases" ? "" : "+"}
                    {cases}
                </h2>
                
                <Typography className="infoCard_title" color="textSecondary" style={{color:color}}>
                    Total {total}
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoCard;
