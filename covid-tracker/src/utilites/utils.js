export default function sortData(data) {

    let sortedData = [...data];

    sortedData.sort((a, b) => {
        
        return (Number(a.confirmed) > Number(b.confirmed) ) ? -1 : 1;
    })

    return sortedData;
}