const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Search field can not be empty</h2>';
        return
    }
    movie.innerHTML = '<div class="spinner"></div>';
    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-warning">Nothing was found</h2>';
            };
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                const poster = item.poster_path ? urlPoster + item.poster_path : './noposter.png';
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem} </h5>
            </div>
            `;
            });
            movie.innerHTML = inner;
            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = 'Oops! Something goes wrong...';
            console.log('error: ' + reason);
        });
}
searchForm.addEventListener('submit', apiSearch);
function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo)
    });
}
function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=41e60f9dbbb21b06adfbdef7dcd2ce30&language=en-US';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=41e60f9dbbb21b06adfbdef7dcd2ce30&language=en-US';
    } else {
        movie.innerHTML = 'Oops! Something goes wrong...';
    }
    fetch(url)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then(function (output) {
            console.log(output);
            movie.innerHTML = `
        <h4 class="col-12 text-info text-center">${output.name || output.title}</h4>
        <div class="col-4">
            <img src='${urlPoster + output.poster_path}' alt='${output.name || output.title}'>
            ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank">Official page</a></p>` : ''}
            ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank">IMDB page</a></p>` : ''}
        </div>
        <div class="col-8">
            <p>Rating: ${output.vote_average}</p>
            <p>Status: ${output.status}</p>
            <p>Release Date: ${output.first_air_date || output.release_date}</p>
            ${(output.last_episode_to_air) ? `<p> ${output.number_of_seasons} season ${output.last_episode_to_air.episode_number} episodes</p>` : ''}
            <p>Overview: ${output.overview}</p>
        </div>
        `;
        })
        .catch(function (reason) {
            movie.innerHTML = 'Oops! Something goes wrong...';
            console.log('error: ' + reason);
        });
}
document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=41e60f9dbbb21b06adfbdef7dcd2ce30&language=en')
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '<h2 class="col-12 text-center text-warning">Weekly trending</h2>';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-warning">Nothing was found</h2>';
            };
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                const poster = item.poster_path ? urlPoster + item.poster_path : './noposter.png';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem} </h5>
            </div>
            `;
            });
            movie.innerHTML = inner;
            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = 'Oops! Something goes wrong...';
            console.log('error: ' + reason);
        });
});