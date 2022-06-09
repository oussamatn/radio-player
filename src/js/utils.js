/**
 * Common utils
 */
export function trunkNum(toMin, toMax, value,min = 0, max = 255) {
    //Trunk frequency values;
    if (isNaN(value)) return toMax;

    const x = (toMax - toMin) / (max - min)
    return (value * x + min);

}
export function parseParam(param) {
    return Object.keys(param).map(k => `${k}=${encodeURIComponent(param[k] + '')}`).join('&')
}
export function decodeBase64(data) {
    if (typeof atob === "function") {
        return atob(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
}
export function stringeq(str, sub, offset) {
    let eq = true
    if (sub.length + offset > str.length) return false
    for (let i = 0; i < sub.length; i++) {
        if (sub[i] != str[i + offset]) return false
    }
    return eq
}

export function time2ms(time) {
    const [m, s] = time.split(/:/).map(s => parseInt(s.trim()))
    if (isNaN(m) || isNaN(s)) throw new Error('time format error')
    return (m * 60 + s) * 1000
}

export default {

chunkArray(arr, size) {
    Array.from({ length: Math.ceil(arr.length / size) },
        (v, i) => arr.slice(i * size, i * size + size));
},
// get search results off a list for an obj key
search(list, key, search)
{
    const regxp = new RegExp('^(' + search + ')', 'i');
    return list.filter(item => regxp.test(item[key]));
}
,

// sort objects in an array by a key
sort(list, key, order, ignore)
{
    return list.sort((a, b) => {
        if (a.hasOwnProperty(key)) {

            let _a = a[key];
            let _b = b[key];

            if (ignore) { // sort strings using same case
                _a = (typeof _a === 'string') ? _a.toUpperCase() : _a;
                _b = (typeof _b === 'string') ? _b.toUpperCase() : _b;
            }
            if (order === 'asc') {
                if (_a < _b) return -1;
                if (_a > _b) return 1;
            }
            if (order === 'desc') {
                if (_a > _b) return -1;
                if (_a < _b) return 1;
            }
        }
        return 0;
    });
}
,

}
