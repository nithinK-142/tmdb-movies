const api_key = "YOUR_TMBD_API";

const APIURL_POPULAR = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" + api_key;
const APIURL_TOP_RATED = "https://api.themoviedb.org/3/movie/top_rated?&api_key=" + api_key + "&page=1";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

$(document).ready(function() {
    const label = $("#label");
    const main = $("#main");
    const footer = $("footer");
    let originalLabelText = label.text();

    label.click(function() {
        toggleLabelText();
        toggleMainContent();
    });

    function toggleLabelText() {
        if (label.text() === originalLabelText) {
            label.text("top rated movies");
        } else {
            label.text(originalLabelText);
        }
    }

    function toggleMainContent() {
        main.empty();
        footer.hide();

        if (label.text() === "top rated movies") {
            getMovies(APIURL_TOP_RATED);
        } else {
            getMovies(APIURL_POPULAR);
        }
    }

    async function getMovies(url) {
        const resp = await fetch(url);
        const respData = await resp.json();
        showMovies(respData.results);
        footer.show();
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

    getMovies(APIURL_POPULAR);
});
