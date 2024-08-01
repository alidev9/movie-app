<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();
$tmdb_k = getenv('TMDB_K');

class CatalogueItem {
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

$current_month = date('m');

function requestCurrentMonthReleases($year, $month){
  $last_day_in_month = new DateTime("$year-$month-01");
  $last_day_in_month = $last_day_in_month->modify('last day of this month')->format('Y-m-d');

  requestWeekReleases("$year-$month-01", "$year-$month-07", 1);
  requestWeekReleases("$year-$month-08", "$year-$month-14", 2);
  requestWeekReleases("$year-$month-15", "$year-$month-20", 3);
  requestWeekReleases("$year-$month-21", $last_day_in_month, 4);
}

function requestWeekReleases($first_day, $last_day, $week_no){
?>
</br>
Week <?php echo $week_no?>
</br> 
<?php
  global $client;
  global $tmdb_k;
  $response = $client->request('GET', "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=$first_day&primary_release_date.lte=$last_day&sort_by=popularity.dsc&with_origin_country=US&with_release_type=3|2", [
    'headers' => [
      'Authorization' => 'Bearer ' . $tmdb_k,
      'accept' => 'application/json',
    ],
  ]);

  $movie_list_json = $response->getBody();
  $movie_list_array = json_decode($movie_list_json)->results;

  $catalogue_item_array = [];
  for($i = 0; $i < 10; $i++){
    $current_movie = $movie_list_array[$i];
    $catalogue_item_array[$i] 
      = new CatalogueItem(
          $current_movie->id,
          $current_movie->original_title,
          $current_movie->release_date,
          $current_movie->poster_path
      );
  }
  echo json_encode($catalogue_item_array);
}

requestCurrentMonthReleases(2024, $current_month);
