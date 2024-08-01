<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();
$tmdb_k = getenv('TMDB_K');

$response = $client->request('GET', 'https://api.themoviedb.org/3/movie/15?language=en-US', [
  'headers' => [
    'Authorization' => 'Bearer ' . $tmdb_k,
    'accept' => 'application/json',
  ],
]);

echo $response->getBody();
