<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();
$tmdb_k = getenv('TMDB_K');

class MovieListItem {
  public $id;
  public $original_title;
  public $date;
  public $poster_path;
  public function __construct($id, $original_title, $date, $poster_path){
    $this->id = $id;
    $this->original_title = $original_title;
    $this->date = $date;
    $this->poster_path = $poster_path; 
  }
}

class MonthReleases{
  //MonthReleases holds an array of WeekReleases
  public $week_releases;
  public function __construct($week_releases){
    $this->week_releases = $week_releases;
  }
}

class WeekReleases{
  public $index;
  public $movie_list;
  public $week_range;
  public function __construct($index, $week_range, $movie_list){
    $this->index = $index;
    $this->week_range = $week_range;
    $this->movie_list = $movie_list;
  }
}

function requestMonthReleases($month, $year){
  $last_day_of_month = new DateTime("$year-$month-01");
  $last_day_of_month = $last_day_of_month->modify('last day of this month')->format('d');

  $month_releases = new MonthReleases([]);
  for($i = 0, $day = 1; $i < 4; $i++, $day += 7){
    $week_start = convertDayToStr($day);
    $i < 3 ? $week_end = convertDayToStr($day + 6) : $week_end = $last_day_of_month; 
    $movie_list = requestWeekReleases("$year-$month-$week_start", "$year-$month-$week_end");
    //week_releases object
    $week_releases = new WeekReleases($i + 1, [$week_start, $week_end], $movie_list);
    //Appending the array in Month releases object
    $month_releases->week_releases[] = $week_releases;
  }
  echo json_encode($month_releases);
}

//Convert day integer to valid string
function convertDayToStr($day){
  $day < 10 ? $day_string = '0' . $day : $day_string = (string) $day;
  return $day_string;
}

function requestWeekReleases($first_day, $last_day){
  global $client;
  global $tmdb_k;
  $response = $client->request('GET', "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=$first_day&primary_release_date.lte=$last_day&sort_by=popularity.dsc&with_origin_country=US&with_release_type=3|2", [
    'headers' => [
      'Authorization' => 'Bearer ' . $tmdb_k,
      'accept' => 'application/json',
    ],
  ]);

  $response_json = $response->getBody();
  $response_array = json_decode($response_json)->results;

  $movie_list = [];
  for($i = 0; $i < 10 && $i < sizeof($response_array); $i++){
    $current_movie = $response_array[$i];
    $movie_list[$i] 
      = new MovieListItem(
          $current_movie->id,
          $current_movie->original_title,
          $current_movie->release_date,
          $current_movie->poster_path
      );
  }
  return $movie_list;
}

requestMonthReleases($_GET['month'], $_GET['year']);