import React, { useEffect, useState } from 'react'
import MovieElement from './MovieElement'

function convertMonthIntToStr(monthInt){
    if(monthInt < 10){
        return "0" + monthInt.toString()
    } else {
        return monthInt.toString()
    }
}

async function fetchMonthReleases(month, year) {
    const response = await fetch(`http://localhost:8080/movie-list?month=${month}&year=${year}`)
    const result = await response.json()
    return result
}

function MovieList () {

    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth() //getMonth() is zero-indexed
    const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July'
        , 'August', 'September', 'October', 'November', 'December']

    const [monthData, setMonthData] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(monthArray[currentMonthIndex])
    const [selectedMovie, setSelectedMovie] = useState({})

    function handleSearch(){
        const selectedMonth = document.querySelector('#month-select').value
        const selectedYear = document.querySelector('#year-select').value
        fetchMonthReleases(selectedMonth, selectedYear).then(result => {
            setLoading(true)
            setMonthData(result)
            setLoading(false)
            setSelectedMonth(monthArray[+selectedMonth - 1])
        }).catch((error) => {
            console.log(error.toString())
        })
    }
    
    useEffect(() => {
        fetchMonthReleases(convertMonthIntToStr(currentMonthIndex + 1), currentYear.toString())
            .then(result => {
                setMonthData(result)
                setLoading(false)
            })
    }, [])

    if(loading){
        return <span>Loading...</span>
    } else {
        return ( 
            <>
                <div className='filters'>
                            <label htmlFor="year-select">Year:</label>
                            <select name="year" id="year-select">
                                <option value={currentYear} selected >{currentYear}</option>
                                <option value={currentYear + 1} >{currentYear + 1}</option>
                                <option value={currentYear + 2} >{currentYear + 2}</option>
                            </select>
                            <label htmlFor="month-select">Month:</label>
                            <select name="month" id="month-select">
                                {monthArray.map((month, index) => {
                                        return(
                                            <option value={convertMonthIntToStr(index + 1)} 
                                                selected={index === currentMonthIndex} >{month}</option>
                                        )
                                })}
                            </select>
                            <button onClick={handleSearch}>Search</button>
                </div>
                <div className="movie-list-container">
                    <div className="movie-list-inner-wrapper">
                        {monthData.week_releases.map((week) => {
                            return (
                                <>
                                    <div className="movie-group-container">
                                        <h2>{selectedMonth} {week.week_range[0] + ' - '+ week.week_range[1]}</h2>
                                        {week.movie_list.map((movie, index) => {
                                            return (
                                                <MovieElement movie={movie} index={index} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie}/>
                                            )
                                        })}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }
}

export default MovieList