/**
 * Soma-FM API handler
 */
var API= 'https://jelliti.me';
export default {

  // get channels data from api
  getChannels( callback ) {
    const apiurl = API+'/api/stations';
    const error  = 'There was a problem fetching the latest list of music channels from JoujmaFM.';

    axios.get( apiurl ).then( res => {
      const list = this._parseChannels( res.data );
      if ( !list.length ) return callback( error, [] );
      return callback( null, list );
    })
    .catch( e => {
      return callback( error + String( e.message || '' ), [] );
    });
  },

  // fetch songs for a channel
  getSongs( channel, callback ) {

    const apiurl = channel.songsurl || '';
    const title  = channel.name || '...';
    const error  = 'There was a problem loading the list of songs for channel '+ title +' from JoujmaFM.';

    axios.get( apiurl ).then( res => {
      if ( !res.data ) return callback( error, [] );
      return callback( null, res.data );
    })
    .catch( e => {
      return callback( error + String( e.message || '' ), [] );
    });
  },

  // parse channels list from api response
  _parseChannels( channels ) {
    let output = [];
    
    if ( Array.isArray( channels ) ) {
      for ( let c of channels ) {
        //if ( !Array.isArray( c.playlists ) ) continue;
        //c.plsfile   = c.playlists.filter( p => ( p.format === 'mp3' && /^(highest|high)$/.test( p.quality ) ) ).shift().url || '';
        c.mp3file   = c.listen_url;
        c.image     = '/img/'+c.shortcode+'.png';
        c.songsurl  = API+'/api/nowplaying/'+ c.id;
        c.twitter   = 'https://twitter.com/@';
        c.route     = '/channel/'+ c.shortcode;
        c.favorite  = false;
        c.active    = false;
        output.push( c );
      }
    }
    
    return output;
  }
}
