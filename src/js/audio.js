/**
 * Audio handler object
 */
import { AudioContext } from 'standardized-audio-context';

export default {
    _audio: new Audio(),
    _context: new AudioContext(),
    //_context: new (new AudioContext || (window.AudioContext || window.webkitAudioContext))(),
    _freq: new Uint8Array(),
    _source: null,
    _gain: null,
    _analyser: null,

    // setup audio routing
    setupAudio() {
        console.log("setupAudio");
        if (this._source ==null ) this._source = this._context.createMediaElementSource(this._audio);

        //Audio gain to manage volume
        if (this._gain ==null ) this._gain = this._context.createGain();
        this._source.connect(this._gain);
        this._gain.connect(this._context.destination);
        // Wait for audio load buffer
        this._audio.addEventListener('canplaythrough', e => {
                this.playAudio();
        });
        // Frequency Analyzer
        if (this._analyser ==null ) this._analyser = this._context.createAnalyser();
        this._source.connect(this._analyser);

        // Activate AudioContext on user event
        if (this._context.state === 'suspended') this.unlockAudioContext(this._context);
        return this._audio;
    },
// update and return analyser frequency data
    getFreqData() {
        if (this._analyser ==null ) return 1;
        this._analyser.getByteFrequencyData(this._freq);
        return this._freq;
    },

    playAudio(){
        if (this._context.state === 'running') {
            this._freq = new Uint8Array(this._analyser.frequencyBinCount);
            this._audio.play().catch(e => {
                console.log("audio :" + e);
            })
        }
    },
    unlockAudioContext(audioCtx) {
        if (audioCtx.state === 'suspended') {
            var events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
            var unlock = function unlock() {
                console.log("audioContext state: " + audioCtx.state);
                if (audioCtx.resume) audioCtx.resume().then(()=>{
                    console.log("audioContext resume state: " + audioCtx.state);
                    if (audioCtx.state !== 'suspended') {
                        events.forEach(function (event) {
                            document.body.removeEventListener(event, unlock)
                        });
                    }
                });
            };
            events.forEach(function (event) {
                document.body.addEventListener(event, unlock, false)
            });
        }
    },
// set audio volume
    setVolume(volume) {
        if (!this._gain) return;
        volume = parseFloat(volume) || 0.0;
        volume = (volume < 0) ? 0 : volume;
        volume = (volume > 1) ? 1 : volume;
        this._gain.gain.value = volume;
    },

// play audio source url
    playSource(source) {
        this.stopAudio();
        this._audio.src = String(source || '');
        this._audio.crossOrigin = 'anonymous';
        this._audio.load();
    },

// stop playing audio
    stopAudio() {
        try {
            this._audio.pause(0);

        } catch (e) {
            console.log(e);
        }

    },
}
