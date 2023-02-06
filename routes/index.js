var express = require('express');
var router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(process.env.clientId)
  res.render('index', { title: 'Express' });
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
  // router.get('/artist-search-results')
router.get('/artist-search', (req,res)=>{
  spotifyApi
  .searchArtists(req.query.name)
  .then(data => {
    let artistData = data.body.artists.items
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results.hbs', {artistData})
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((data)=>{
    let albumData = data.body.items;
    // console.log(albumData[0].artists)
    res.render('albums.hbs', {albumData})
  })
  .catch(err => console.log('The error while retrieving albums occurred: ', err));

});


router.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then((data)=>{
    let trackData = data.body.items;
    // console.log(albumData[0].artists)
    res.render('tracks.hbs', {trackData})
  })
  .catch(err => console.log('The error while retrieving albums occurred: ', err));
});


module.exports = router;
