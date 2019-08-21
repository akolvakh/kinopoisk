const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
movie.innerHTML = 'Loading...';
function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=41e60f9dbbb21b06adfbdef7dcd2ce30&language=en&query=' + searchText;
    requestApi(server)
        .then(function(result){
            const output = JSON.parse(result);
            console.log(output);
            let inner = '';
            output.results.forEach(function (item, i, array){
            let nameItem = item.name || item.title;
            inner += '<div class="col-12">' + nameItem + '</div>';
        });
        movie.innerHTML = inner;
        })
        .catch(function(reason){
            movie.innerHTML = 'Oops! Something goes wrong...';
            console.log('error: ' + reason.status);
        });
        
}


searchForm.addEventListener('submit', apiSearch);


function requestApi(url){
    return new Promise (function (resolve, reject){
        
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', function (){
            if (request.status !== 200){
                reject({status: request.status});
                return;
            }

            resolve(request.response);

        });

        request.addEventListener('error', function (){
            reject({status: request.status});
            
        });
        request.send();

    });
    
}
    
    // request.addEventListener('readystatechange', function () {
    //     if (request.readyState !== 4) {
    //         movie.innerHTML = 'Loading...';
    //         return; 
    //     }
    //     if (request.status !== 200){
    //         movie.innerHTML = 'Oops! Something goes wrong...';
    //         console.log('error: ' + request.status);
    //         return; 
    //     }
    //     const output = JSON.parse(request.responseText);

    // });
