// http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=Balti%20Ya%20Hasra&duration=300

import {decodeBase64, parseParam, stringeq} from "@/js/utils";


export default {
    api_search: "https://cors-anywhere.herokuapp.com/http://lyrics.kugou.com/search",
    api_fetch: "https://cors-anywhere.herokuapp.com/http://lyrics.kugou.com/download",
    async search(song, duration) {

        const url = this.api_search + '?' + parseParam({
            ver: 1,
            man: 'yes',
            client: 'pc',
            keyword: song,
            duration: duration
        })

        console.log(url)
        const response = await fetch(url)

        if (response.ok) {
            console.log(response.headers.get('date'))
            const {candidates} = await response.json()
            return Promise.resolve(candidates);
        } else {
            return Promise.reject('*** Cannot get lyrics');
        }

    },
    async fetchLyrics(id, accesskey) {
        const url = this.api_fetch + '?' + parseParam({
            ver: 1,
            client: 'pc',
            id: id,
            accesskey: accesskey,
            fmt: 'lrc',
            charset: 'utf8'
        })
        console.log(url)
        const response = await fetch(url)
        if (response.ok) {
            console.log(response.headers.get('date'))
            const jsonValue = await response.json()
            return Promise.resolve(jsonValue);
        } else {
            return Promise.reject('*** Cannot get lyrics');
        }

    },


    async getLyrics(song, duration) {

        let search_for_lyrics = await this.search(song, duration);
        let condidat = search_for_lyrics[0]
        if (condidat) {
            let lyrics = await this.fetchLyrics(condidat.id, condidat.accesskey)
            let buf = decodeBase64(lyrics.content)
            console.log(buf)
            console.log(this._parseLyrics(buf))
            return Promise.resolve(this._parseLyrics(buf))

        }
        return Promise.reject('Cannot get lyrics from kugou');

    },

    _parseLyrics(content) {

        const lrc = {items: []}
        const lines = (content + '').trim().split(/\r?\n/).map(s => s.trim()).filter(s => !!s)

        lines.forEach(line => {

            if (stringeq(line, '[ti:')) lrc.ti = line.match(/\[ti:([\s\S]*?)\]/)[1]
            else if (stringeq(line, '[ar:')) lrc.ar = line.match(/\[ar:([\s\S]*?)\]/)[1]
            else if (stringeq(line, '[al:')) lrc.al = line.match(/\[al:([\s\S]*?)\]/)[1]
            else if (stringeq(line, '[by:')) lrc.by = line.match(/\[by:([\s\S]*?)\]/)[1]
            else if (stringeq(line, '[offset:')) lrc.offset = line.match(/\[offset:([\s\S]*?)\]/)[1]

            else {

                const match = line.match(/^((\[\d+:\d+(\.\d+)?\])+)([\s\S]+?)$/)
                if (!match) return
                const times = match[1].trim()
                const text = match[4].trim()

                const tmatch = times.match(/(\[\d+:\d+(\.\d+)?\])/g)
                if (!tmatch) return

                tmatch.map(t => t.trim()).map(t => t.substr(1, t.length - 2)).forEach(time => {

                    const match = time.match(/^(\d+):(\d+)(\.\d+)?$/)
                    if (!match) return
                    let [_, m, s, ms] = match

                    let t = (parseInt(m) * 60 + parseInt(s)) * 1000
                    if (ms) {
                        ms = ms.substr(1)
                        if (ms.length == 2) t += parseInt(ms) * 10
                        else t += parseInt(ms)
                    }
                    if (isNaN(t)) return

                    lrc.items.push({time: t, content: text})
                })
            }
        })

        lrc.items = lrc.items.sort((a, b) => {
            if (a.time == b.time) return 0
            if (a.time > b.time) return 1
            return -1
        })
        return lrc.items

    }

}