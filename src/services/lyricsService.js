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


            const jsonValue = await response.json()
                //.then((data)=>{
                //console.log(this._parseLyrics(jsonValue));
            //}); // Get JSON value from the response body

            return Promise.resolve(this._parseLyrics(jsonValue));
        } else {
            return Promise.reject('*** Cannot get lyrics');

        }

    },
    _parseLyrics(lyrics){
        let output=[];
        let temp ={content:null,time:null}
        for(let item of lyrics){
            temp.content = item.lyrics
            temp.time = item.seconds * 1000
            output.push(temp)
        }


        return output;
    }

}