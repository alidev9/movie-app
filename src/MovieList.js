import React, { useEffect, useState } from 'react'
import MovieDetails from './MovieDetails'


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

async function fetchMovieDetails(movieID){
    const response = await fetch(`http://localhost:8080/movie-details?movie_id=${movieID}`)
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
    const [selectedMovie, setSelectedMovie] = useState({})

    function handleSearch(e){
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
    function displayMovieDetails(e){
        fetchMovieDetails(e.currentTarget.id).then(result => {
            setSelectedMovie(result)
        })
    }
    
    useEffect(() => {
        fetchMonthReleases(convertMonthIntToStr(currentMonthIndex + 1), currentYear.toString())
            .then(result => {
                setMonthData(result)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if(selectedMovie.id){
            const selectedMovieElement = document.getElementById(`${selectedMovie.id}`)
            const movieGridPosition = +selectedMovieElement.dataset.gridPosition + 1
            //Determining where to place movieDetails
            const gridRow = +movieGridPosition%2 === 0 ? +movieGridPosition/2 : (+movieGridPosition+1)/2
            const movieDetailsContainer = document.querySelector('.movie-details')
            movieDetailsContainer.style.gridRow = `${gridRow + 2} / ${+gridRow + 3}`   
        }
    }, [selectedMovie])

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
                    {monthData.week_releases.map((week) => {
                        return (
                            <>
                                <div className="movie-group-container">
                                    <h2>{selectedMonth} {week.week_range[0] + ' - '+ week.week_range[1]}</h2>
                                    {week.movie_list.map((movie, index) => {
                                        return(
                                            <>
                                                <div key={movie.id} id={movie.id} data-grid-position={index}className='movie-poster-container' onClick={displayMovieDetails}>
                                                    <img src={`https://image.tmdb.org/t/p/w154/${movie.poster_path}`}
                                                    alt={movie.original_title + ' Poster'} />
                                                    <div className='movie-poster-title'>{movie.original_title}</div>
                                                </div>
                                                {selectedMovie.id === movie.id && <MovieDetails selectedMovie={selectedMovie}/>}
                                            </>
                                        )
                                    })}
                                </div>                            
                            </>
                        )
                    })}
                </div>
            </>
        )
    }
}

export default App