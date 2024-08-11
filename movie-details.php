<?php
require_once('vendor/autoload.php');

header('Content-Type: application/json');

$client = new \GuzzleHttp\Client();
$tmdb_k = getenv('TMDB_K');
$movie_id = $_GET['movie_id'];

$response = $client->request('GET', "https://api.themoviedb.org/3/movie/$movie_id?language=en-US", [
    'headers' => [
      'Authorization' => 'Bearer '. $tmdb_k,
      'accept' => 'application/json',
    ],
  ]);

$reponse_json = $response->getBody();
$response_object = json_decode($reponse_json);

//dynamic objects are used here as we only need $movie_details for a simple purpose
$movie_details = new stdClass();

$movie_details->id = $response_object->id;
$movie_details->original_title = $response_object->original_title;
$movie_details->tagline = $response_object->tagline;
$movie_details->backdrop_path = $response_object->backdrop_path;
$movie_details->overview = $response_object->overview;
$movie_details->release_date = $response_object->release_date;
$movie_details->genres = $response_object->genres;

echo json_encode($movie_details);
