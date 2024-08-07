import React, { useEffect, useState } from 'react'

function convertMonthIntToStr(monthInt){
    if(monthInt < 10){
        return "0" + monthInt.toString()
    } else {
        return monthInt.toString()
    }
}

async function fetchMonthReleases(month, year) {
    const response = await fetch(`http://localhost:8080/movie-calendar.php?month=${month}&year=${year}`)
    const result = await response.json()
    return result
}

function App () {

    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth() //getMonth() is zero-indexed
    const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July'
        , 'August', 'September', 'October', 'November', 'December']

    const [monthData, setMonthData] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(monthArray[currentMonthIndex])
    
    useEffect(() => {
        fetchMonthReleases(convertMonthIntToStr(currentMonthIndex + 1), currentYear.toString())
            .then(result => {
                setMonthData(result)
                setLoading(false)
            })
    }, [])

    function handleYearChange(e){

    }
    function handleMonthChange(e){

    }

    if(loading){
        return <span>Loading...</span>
    } else {
        return ( 
            <>
                <div className='filters'>
                            <label htmlFor="year-select">Year:</label>
                            <select name="year" id="year-select">
                                <option value={currentYear} selected onClick={handleYearChange}>{currentYear}</option>
                                <option value={currentYear + 1} onClick={handleYearChange}>{currentYear + 1}</option>
                                <option value={currentYear + 2} onClick={handleYearChange}>{currentYear + 2}</option>
                            </select>
                            <label htmlFor="month-select">Month:</label>
                            <select name="month" id="month-select">
                                {monthArray.map((month, index) => {
                                        return(
                                            <option value={convertMonthIntToStr(index + 1)} 
                                                selected={index === currentMonthIndex}
                                                onClick={handleMonthChange}>{month}</option>
                                        )
                                })}
                            </select>
                </div>
                {monthData.week_releases.map((week) => {
                    return (
                        <>
                            <h2>{selectedMonth} {week.week_range[0] + ' - '+ week.week_range[1]}</h2>
                            {week.movie_list.map((movie) => {
                                return(
                                    <>
                                        <img src={`https://image.tmdb.org/t/p/w154/${movie.poster_path}`} 
                                        alt={movie.original_title + ' Poster'} />
                                    </>
                                )
                            })}
                        </>
                    )
                })}
            </>
        )
    }
}

export default App