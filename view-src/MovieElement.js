import React, { useEffect, useState } from 'react'
import MovieDetails from './MovieDetails'

async function fetchMovieDetails(movieID){
    const response = await fetch(`http://localhost:8080/movie-details?movie_id=${movieID}`)
    const result = await response.json()
    return result
}

function MovieElement({movie, index, selectedMovie, setSelectedMovie}){

    const [movieDetailsHidden, setMovieDetailsHidden] = useState(true)
    
    //event handler for clicking a MovieElement
    function displayMovieDetails(e){
        const movieDetailsElement = document.querySelector('.movie-details')
        if(movieDetailsElement && movieDetailsElement.dataset.movieId === e.currentTarget.id){
            setMovieDetailsHidden(true)
        } else {
            fetchMovieDetails(e.currentTarget.id).then(result => {
                setMovieDetailsHidden(false)
                setSelectedMovie(result)
            })
        }
    }

    //Determining where to place movieDetails
    useEffect(() => {
        if(selectedMovie.id && !movieDetailsHidden){
            const selectedMovieElement = document.getElementById(`${selectedMovie.id}`)
            const movieGridPosition = +selectedMovieElement.dataset.gridPosition + 1
            const gridRow = +movieGridPosition%2 === 0 ? +movieGridPosition/2 : (+movieGridPosition+1)/2
            const movieDetailsContainer = document.querySelector('.movie-details')
            movieDetailsContainer.style.gridRow = `${gridRow + 2} / ${+gridRow + 3}`   
        }
    }, [selectedMovie])
    
    return(
        <>
            <div key={movie.id} id={movie.id} data-grid-position={index}className='movie-poster-container' onClick={displayMovieDetails}>
                <img src={`https://image.tmdb.org/t/p/w154/${movie.poster_path}`}
                alt={movie.original_title + ' Poster'} />
                <div className='movie-poster-title'>{movie.original_title}</div>
            </div>
            {selectedMovie.id === movie.id && !movieDetailsHidden && <MovieDetails selectedMovie={selectedMovie}/>}
        </>
    )
}

export default MovieElement