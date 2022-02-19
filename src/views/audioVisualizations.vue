<template >
<!--  -->
  <div class="player-canvas" v-if="_isPlayerVisible()">

    <canvas id="player-canvas"></canvas>
    <div id="player-vanta"  style="position: absolute"></div>
  </div>

</template>

<script>
import _scene from '../js/scene'
import HALO from '../js/lib/vanta.halo.min'
import TRUNK from '../js/lib/vanta.trunk.min'
import WAVES from '../js/lib/vanta.waves.min'
import _audio from '../js/audio';

const _TRUNK  = Symbol("TRUNK")
const _SPHERE = Symbol("SPHERE")
const _HALO   = Symbol("HALO")
const _WAVES  = Symbol("WAVES")
const animationsType = ['_TRUNK', '_SPHERE', '_HALO', '_WAVES']

export default {
  name: "audioVisualizations",
  data:()=>{
    return{
      animationType: '_HALO',
      visible: true,
      audioVizu:null,
      _box:null,
      _wrap:null,
      anf: null,
      sto: null,
      itv: null,
    }
  },
  watch: {

  },
  mounted() {
    console.log("audioVisualizationm: mounted _isPlayerVisible:"+this._isPlayerVisible())
    //if(this._isPlayerVisible()){
      this.setupCanvas();
      this.updateCanvas();
    //}
    this.$root.$on('selectAnimationType', data => {
      console.log("on selectAnimationType:"+data);
      this.animationTypeSelect(data)
    });

    
  },

  methods:{
    animationTypeSelect (animationTypeSel) {
      // if(!animationsType.includes(animationTypeSel)) return;
      this.audioVizu.destroy()
      this.animationType = animationTypeSel;
      console.log("animationTypeSelect:" ); console.log(animationTypeSel)
      this.setupCanvas();
      this.updateCanvas();
    },
    _isPlayerVisible(){
      return !(document.querySelector( '#player-wrap' ))
    },
    _isSphere(){
      return (this.animationType === _SPHERE )
    },
    // setup animation canvas
    setupCanvas() {
      this._wrap = document.querySelector( '#player-wrap' );
      this._box = this._wrap.getBoundingClientRect();

      this.setupAnimation(this.animationType)
      document.addEventListener('visibilitychange', e => {
        this.visible = (document.visibilityState === 'visible')
      });
      window.addEventListener( 'resize', this.updateSize.bind( this ) );
      
    },
    setupAnimation(type){
      let vantaOptions = {
        el: document.querySelector( '#player-vanta' ),
        backgroundAlpha: 0,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: this._box.height ,
        minWidth: this._box.width,
        color: 0x382a82,
        amplitudeFactor: 1.50,
        xOffset: -0.02,
        size: 2.00
      };
      switch (type){
        default:
        case '_HALO':
          this.audioVizu = HALO(vantaOptions)
          break;
        case '_TRUNK':
          this.audioVizu = TRUNK(vantaOptions)
          break;
        case '_WAVES' :
          this.audioVizu = WAVES(vantaOptions)
          break;
        case '_SPHERE':
          //this.audioVizu = _scene
          //this.audioVizu.setupCanvas();
          break;
      }
    },
    updateSize(){
      if (this._isSphere()) return;
      this._box = this._wrap.getBoundingClientRect();
      this.audioVizu.setOptions({
        minHeight: this._box.height,
        minWidth: this._box.width,
      });
      this.audioVizu.resize()
    },
    // audio visualizer animation loop
    updateCanvasTrunk(freq){
      //Trunk
     let chaos  = (Math.floor( freq[ 1 ] | 0 ) / 255 ) * 5;
     let spacing = (Math.floor( freq[ 16 ] | 0 ) / 255) * 5;
     this.audioVizu.setOptions({
         spacing:spacing,
         chaos:chaos,
     });
      },
     updateCanvasWaves(freq){

     let waveHeight  = (Math.floor( freq[ 1 ] | 0 ) / 255 )* 5;
     let shininess = (Math.floor( freq[ 16 ] | 0 ) );
     let waveSpeed = ((Math.floor( freq[ 3 ] | 0 ) / 255)/2 );
     let zoom = (Math.floor( freq[ 16 ] | 0 ) / 255);
     this.audioVizu.setOptions({
       shininess: shininess,
       waveHeight: waveHeight,
       waveSpeed: waveSpeed,
       zoom: zoom,
     });
     },
    updateCanvaHalo(freq){
      //Halo
      let bass = ( Math.floor( freq[ 1 ] | 0 ) / 255 );
      let dist  = Math.floor( freq[ 1 ] | 0 ) / 255;
      let offset = ((Math.floor( freq[ 16 ] | 0 ) / 255)/2 )-0.25;

      this.audioVizu.setOptions({
        size:bass,
        amplitudeFactor:dist,
        xOffset: offset
      });
     },

    updateCanvas() {
      this.anf = requestAnimationFrame( this.updateCanvas );
      if ( !this.visible ) return;
      if(this.audioVizu === null) return;
      const freq = _audio.getFreqData();

      if(this._isSphere() ) {
        this.audioVizu.updateObjects( freq );
      }else {
        switch (this.animationType) {
          case '_HALO':
            this.updateCanvaHalo(freq);
            break;
          case '_WAVES':
            this.updateCanvasWaves(freq);
            break;
          case '_TRUNK':
            this.updateCanvasTrunk(freq);
            break;
          case '_DISABLE':
          default:
            this.audioVizu.destroy()
            break;
        }
        this.audioVizu.resize()
      }
    },

  },
  beforeDestroy() {
    if (this.audioVizu) {
      this.audioVizu.destroy()
    }
  }

}
</script>

<style scoped>
#player-vanta{
  position: absolute;
  top: 0px;
}
</style>