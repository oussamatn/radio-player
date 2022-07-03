/**
 * Joujma  API handler
 */
import axios from 'axios';

import config from 'config';
import { getters } from './../store/playerConfig'

axios.interceptors.request.use( x => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {}
    x.meta.requestStartedAt = new Date().getTime();
    return x;
})

axios.interceptors.response.use( x => {
        console.log(`Execution time for: ${x.config.url} - ${ new Date().getTime() - x.config.meta.requestStartedAt} ms`)
        return x;
    },
    // Handle 4xx & 5xx responses
    x => {
        console.error(`Execution time for: ${x.config.url} - ${new Date().getTime() - x.config.meta.requestStartedAt} ms`)
        throw x;
    }
)

export default {
    // get now playing response
    config : getters["playerConfig/getConfig"],
    get(){
        let apiurl = config.api_url+'/nowplaying';
        return axios.get( apiurl ).then( res => {
            const list = this._parseChannels( res.data );
            console.log("Nowplaying Service :  get : ",list)
            return list;
        });
    },
    // get channels data from api
    getChannels(  ) {
        let apiurl = config.api_url+'/stations';
        //let error  = 'There was a problem fetching the latest list of channels from JoujmaFM.';
        return axios.get( apiurl ).then( res => {
            const list = this._parseChannels( res.data );
            if ( !list.length ) return error;
            return list;
        })

    },

    // fetch songs for a channel
    getSongs( channel_id ) {
        console.log("Nowplaying Service :  getSongs : ", channel_id)
        let apiurl =   config.api_url+'/nowplaying/'+ channel_id;
        return axios.get( apiurl ).then( res => {
            //if ( !res.data ) return callback( error, [] );
            res.data.station = this._parseChannel( res.data.station );
            console.log("Nowplaying Service :  getSongs : ", res.data)
            return res.data ;
        });
    },

    // parse channels list from api response
    _parseChannel( c ) {
                c.mp3file   = c.listen_url;
                c.image     = '/img/stations/'+c.shortcode+'.png' ;
                c.songsurl  = config.api_url+'/nowplaying/'+ c.id;
                c.route     = '/station/'+ c.shortcode;
                c.favorite  = false;
                c.active    = false;

        return c;
    },
    // TODO finish filter for stations :
    _parseChannels( channels ) {
        let output = [];


            console.log("parchannels for loop ")
            for ( let ch of channels ) {
                let c = ch.station;

                if( config.stationsFilterById != null && !config.stationsFilterById.includes(c.id)){
                    c = this._parseChannel( c )
                    //c.image     = '/img/'+c.shortcode+'.png';
                    //c.songsurl  = config.api_url+'/nowplaying/'+ c.id;
                    //c.route     = '/channel/'+ c.shortcode;
                    //c.favorite  = false;
                    //c.active    = false;
                    ch.station = c;
                    output.push( ch );
                }
            }
        return output;
    },
    _stationsFilter(){
      return config.stationsFilterById;
    },

    _parseNowplaying() {
        return undefined;
    }
}
