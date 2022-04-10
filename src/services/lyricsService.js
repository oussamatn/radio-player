import axios from 'axios';
import config from 'config';

export default {
    api_url : "https://cors-anywhere.herokuapp.com/https://api.textyl.co/api/lyrics?q=",
    serverTime :0,
    async getLyrics(song) {

        // let apiurl = "https://cors-anywhere.herokuapp.com/https://api.textyl.co/api/lyrics?q=pnl da da";
        let apiurl = this.api_url + encodeURI(song);
        //let error  = 'There was a problem fetching the Now Playing API from JoujmaFM.';

        const response = await fetch(apiurl); // Generate the Response object
        if (response.ok) {
            console.log(response.headers.get('date'))
            this.serverTime = new Date().valueOf(response.headers.get('date'))
            console.log(this.serverTime)
            console.log(new Date().getTime())

            const jsonValue = await response.json()
                //.then((data)=>{
                //console.log(this._parseLyrics(jsonValue));
            //}); // Get JSON value from the response body

            return Promise.resolve(jsonValue);
        } else {
            return Promise.reject('*** Cannot get lyrics');

        }

    },
    _parseLyrics(lyrics){
        let output=[];

        for(let item of lyrics)
                output.push(item)

        return output;
    }
    // getLyrics(song){
    //
    //     // let apiurl = "https://cors-anywhere.herokuapp.com/https://api.textyl.co/api/lyrics?q=pnl da da";
    //     let apiurl = this.api_url+encodeURI(song);
    //     //let error  = 'There was a problem fetching the Now Playing API from JoujmaFM.';
    //     return axios.get( apiurl,{
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //             "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
    //         }
    //     } ).then( res => {
    //         if(res.data.length>1){
    //             const lyrics = res.data;
    //             //console.log("Lyrics Service :  get : ",lyrics)
    //             return lyrics;
    //         }
    //     }).catch(err => {
    //         console.log(err.response);
    //     });
    //
    // }

}