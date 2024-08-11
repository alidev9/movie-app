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

async function fetchMovieDetails(movieID){
    const response = await fetch(`http://localhost:8080/movie-details.php?movie_id=${movieID}`)
    console.log(response)
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
        })
    }
    function displayMovieDetails(e){
        fetchMovieDetails(e.currentTarget.id).then(result => {
            setSelectedMovie(result)
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
                {monthData.week_releases.map((week) => {
                    return (
                        <>
                            <h2>{selectedMonth} {week.week_range[0] + ' - '+ week.week_range[1]}</h2>
                            {week.movie_list.map((movie) => {
                                return(
                                    <div key={movie.id} id={movie.id} onClick={displayMovieDetails}>
                                        <img src={`https://image.tmdb.org/t/p/w154/${movie.poster_path}`} 
                                        alt={movie.original_title + ' Poster'} />
                                        {selectedMovie.id === movie.id && 
                                            <div className='movie-details'>
                                                <img className="backdrop" src={`http://image.tmdb.org/t/p/w300/${selectedMovie.backdrop_path}`} alt="" />
                                                <h3 className='original-title'>{selectedMovie.original_title}</h3>
                                                <div className='tagline'>{selectedMovie.tagline}</div>
                                                <p className='overview'>{selectedMovie.overview}</p>
                                                <div className="release-date">{selectedMovie.release_date}</div>
                                                <div className="genres">{selectedMovie.genres.map(genre => genre.name)}</div>
                                            </div>}
                                    </div>
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