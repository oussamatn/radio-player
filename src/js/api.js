/**
 * Joujma  API handler
 */
import axios from 'axios';

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
  getSongs( channel_id, callback ) {

    let apiurl =   API+'/api/nowplaying/'+ channel_id;;
    //let title  = channel.name || '...';
    //let error  = 'There was a problem loading the list of songs for channel '+ title +' from JoujmaFM.';

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
  },
  _parseChannel( c ) {
    //let output = [];


        c.mp3file   = c.listen_url;
        c.image     = '/img/'+c.shortcode+'.png';
        //c.songsurl  = API+'/api/nowplaying/'+ c.id;
        c.twitter   = 'https://twitter.com/@';

        c.favorite  = false;
        c.active    = false;
        //output.push( c );

    return c;
  }
}
