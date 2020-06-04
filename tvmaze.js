/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
*/


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *      will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
*/


const MISSING_IMAGE_URL = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove hard coded data.
  const response = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: query
    }
  });
  //console.log(response);
  //console.log(response.data);
  let shows = response.data.map(result => {
    //show is equivalent to response.data.show
    let show = result.show;
    return {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : MISSING_IMAGE_URL
    };
  });
  return shows;
};


/** Populate shows list:
 *     - given list of shows, add shows to DOM
*/
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image ? show.image : MISSING_IMAGE_URL}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-success episode-button" data-toggle="modal" data-target="#exampleModalLong" >Show Episode List</button>
           </div>
         </div>
       </div>
    `);
    $showsList.append($item);
  };
};


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
*/
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").show();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
*/
async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  //console.log(response.data);
  let episode = response.data.map(result => {
    return {
      //id: result.id,
      name: result.name,
      season: result.season,
      episodeNo: result.number
    };
  });
  return episode;
};


/** Given a show ID, populate a list of episodes to the DOM:
 *      { id, name, season, number }
*/
function populateEpisodes(episodes) {
  //TODO: populate array of episodes onto the DOM
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>S${episode.season}:E${episode.episodeNo}: ${episode.name}</li>
    `);
    $episodesList.append($item);
  };
};

//Get showID variable from card data attribute when episodes button is clicked on
//pass that showID to getEpisodes()
$(".container").on("click", ".episode-button", async function(evt) {
  let showId = $(evt.target).parents(".Show").data("show-id");
  let episodes = await getEpisodes(showId);

  populateEpisodes(episodes);
});