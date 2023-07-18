const api_key = "YOUR_TMBD_API";

const APIURL_POPULAR = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" + api_key;
const APIURL_TOP_RATED = "https://api.themoviedb.org/3/movie/top_rated?&api_key=" + api_key + "&page=1";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

$(document).ready(function() {
    const label = $("#label");
    const main = $("#main");
    const footer = $("footer");
    const spinner = $('.loading-spinner');
    let originalLabelText = label.text();
    let isLoading = true;

    label.click(function() {
        toggleLabelText();
        toggleMainContent();
    });

    function toggleLabelText() {
        if (label.text() === originalLabelText) {
            label.text("top movies");
        } else {
            label.text(originalLabelText);
        }
    }

    function toggleSpinner() {
        if (isLoading) {
            spinner.show();
        } else {
            spinner.hide();
        }
    }

    function toggleMainContent() {
        main.empty();
        footer.hide();
        isLoading = true;
        toggleSpinner();

        if (label.text() === "top movies") {
            setTimeout(function() {
                getMovies(APIURL_TOP_RATED);
            }, 500);
        } else {
            setTimeout(function() {
                getMovies(APIURL_POPULAR);
            }, 500);
        }
    }

    async function getMovies(url) {
        const resp = await fetch(url);
        const respData = await resp.json();
        showMovies(respData.results);
        footer.show();
        isLoading = false;
        toggleSpinner();
    }

    function showMovies(movies) {
        movies.forEach((movie) => {
            const { poster_path, title, vote_average, overview } = movie;

            const movieEl = $("<div>").addClass("movie");

            movieEl.html(`
                <img
                    src="${IMGPATH + poster_path}"
                    alt="${title}"
                />
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(
                        vote_average
                    )}">${vote_average}</span>
                </div>
                <div class="overview">
                    <h3>Overview:</h3>
                    ${overview}
                </div>
            `);

            main.append(movieEl);
        });
    }

    function getClassByRate(vote) {
        if (vote >= 8) {
            return "green";
        } else if (vote >= 5) {
            return "orange";
        } else {
            return "red";
        }
    }

    toggleSpinner();
    getMovies(APIURL_POPULAR);
});
