import React, { useState, useEffect } from 'react'

function MovieDetails({selectedMovie}){
    return(
        <div className='movie-details'>
                    <img className="movie-backdrop" src={`http://image.tmdb.org/t/p/w780/${selectedMovie.backdrop_path}`} alt="" />
                    <h3 className='movie-original-title'>{selectedMovie.original_title}</h3>
                    <div className='movie-tagline'>{selectedMovie.tagline}</div>
                    <p className='movie-overview'>{selectedMovie.overview}</p>
                    <div className="movie-release-date">{selectedMovie.release_date}</div>
                    <div className="movie-genres">{selectedMovie.genres.map(genre => genre.name)}</div>
        </div>
    )
}

export default MovieDetails