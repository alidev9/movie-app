<?php
//basic routing
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
switch($request_path){
    case '/':
        include 'dist/index.html';
        break;
    case '/movie-list':
        include 'movie-calendar/movie-list.php';
        break;
    case '/movie-details':
        include 'movie-calendar/movie-details.php';
        break;
    default:
        //TODO 404 Page
}