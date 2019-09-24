/**
 * Audio handler object
 */
export default {
  _audio: new Audio(),
  _audioContext: AudioContext || window.webkitAudioContext,
  _context: new this._audioContext(),
  _freq: new Uint8Array(),
  _source: null,
  _gain: null,
  _analyser: null,

  // setup audio routing
  setupAudio() {
    console.log("setupAudio");

    //this._context =  new AudioContext();
    this._source = this._context.createMediaElementSource( this._audio );
    this._analyser = this._context.createAnalyser();
    this._gain = this._context.createGain();

    this._source.connect( this._gain );
    this._source.connect( this._analyser );
    this._gain.connect( this._context.destination );
   // document.addEventListener("click", this.__context);
    document.addEventListener('click', e => {
      if (this._context.state === "suspended") {
        this._context.resume().then(() => {
          this._context.resume();
          console.log("audioContext has been resumed !");
        });

      };
    });
    

    this._audio.addEventListener( 'canplaythrough', e => {
      console.log('canplaythrough');
      console.log(this._context.state);
      
      if (this._context.state ==='running') {
      this._freq = new Uint8Array( this._analyser.frequencyBinCount );
      
      this._audio.play();
      };

    });
    return this._audio;

  },


  // update and return analyser frequency data
  getFreqData() {
    this._analyser.getByteFrequencyData( this._freq );
    return this._freq;
  },

  // set audio volume
  setVolume( volume ) {
    if ( !this._gain ) return;
    volume = parseFloat( volume ) || 0.0;
    volume = ( volume < 0 ) ? 0 : volume;
    volume = ( volume > 1 ) ? 1 : volume;
    this._gain.gain.value = volume;
  },

  // play audio source url
  playSource( source ) {
    this.stopAudio();
    this._audio.src = String( source || '' );
    this._audio.crossOrigin = 'anonymous';
    this._audio.load();
  },

  // stop playing audio
  stopAudio() {
    try { this._audio.pause(); } catch ( e ) {}
    try { this._audio.stop(); } catch ( e ) {}
    try { this._audio.close(); } catch ( e ) {}
  },
}
