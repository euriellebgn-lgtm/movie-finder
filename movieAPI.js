const API_KEY = "22670ccfeee8269e55cf4d076e4a5d20";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const TRENDING_URL = "https://api.themoviedb.org/3/trending/movie/day";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesDiv = document.getElementById("movies");

searchBtn.addEventListener("click", searchMovie);
searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

async function searchMovie() {
  const query = searchInput.value;

  if (query === "") return;

  const url = `${BASE_URL}?api_key=${API_KEY}&query=${query}`; //API call

  const response = await fetch(url);
  const data = await response.json();  //convert as a JSON

  displayMovies(data.results);
}

async function getTrendingMovies() {
  const url = `${TRENDING_URL}?api_key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  displayMovies(data.results);
}


async function getMovieDetails(movieId) {
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

  const response = await fetch(detailsUrl);
  const movie = await response.json();

  displayMovieDetails(movie);
}

function displayMovieDetails(movie) {
  moviesDiv.innerHTML = `
    <div class="movie-details">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <h2>${movie.title}</h2>
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Release:</strong> ${movie.release_date}</p>
      <p><strong>Runtime:</strong> ${movie.runtime} min</p>
      <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
    </div>
  `;

  getWatchProviders(movie.id);
}

async function getWatchProviders(movieId) {
  const providerUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

  const response = await fetch(providerUrl);
  const data = await response.json();

  const providers = data.results.FR?.flatrate;

  if (!providers) return;

  const providerDiv = document.createElement("div");
  providerDiv.innerHTML = "<h3>Available on:</h3>";
  providerDiv.classList.add("provider");

  providers.forEach(p => {
    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w200${p.logo_path}`;
    img.style.width = "50px";
    providerDiv.appendChild(img);
  });

  moviesDiv.appendChild(providerDiv);
}

function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie");

    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    `;

    movieCard.addEventListener("click", () => {
      getMovieDetails(movie.id);
    });

    moviesDiv.appendChild(movieCard);
  });
}


getTrendingMovies();
