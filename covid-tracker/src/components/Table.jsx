import React from 'react';

function Table({ states,background,handleState,setcurrentState }) {
 
    const handleOver = (state) => {

        if (state === 'Total') {
            state = 'India';
        }

        setcurrentState(state);
    }
    
    return (
        <div className="table" style={{ background: background, borderColor: background }}>
            
            {states.map(({state,confirmed}) => (
                <tr onMouseOver={()=> handleOver(state)} key={state}>
                    <td >{state}</td>
                    <td>    
                        <strong>{confirmed}</strong>
                    </td>
                </tr>
            ))}
            
        </div>
    )
}

export default Table;
