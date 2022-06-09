

export default {
    // api_url : "https://cors-anywhere.herokuapp.com/https://api.textyl.co/api/lyrics?q=",
    // serverTime :0,
    async getConfig() {

        let configName = "/config.json";
        let apiurl = "//"+ location.host+configName;
        //let error  = 'There was a problem fetching the Now Playing API from JoujmaFM.';

        const response = await fetch(apiurl); // Generate the Response object
        if (response.ok) {
            console.log(response.headers.get('date'))
            this.serverTime = new Date().valueOf(response.headers.get('date'))
            console.log(this.serverTime)
            console.log(new Date().getTime())

            const jsonValue = await response.json()

            return Promise.resolve(jsonValue);
        } else {
            return Promise.reject('*** Cannot get config');
        }

    }

}