<template >
<!--  -->
  <div class="player-canvas" v-if="_isPlayerVisible">

    <canvas id="player-canvas"></canvas>
    <div id="canvas-animation" style="position: absolute"></div>
  </div>

</template>

<script>
import _scene from '../../../js/scene'
import HALO from '../../../js/lib/vanta.halo.min'
import TRUNK from '../../../js/lib/vanta.trunk.min'
import WAVES from '../../../js/lib/vanta.waves.min'
import CLOUDS2 from '../../../js/lib/vanta.clouds2.min'
import _audio from '../../../js/audio';
import { trunkNum } from '../../../js/utils'
const animationsType = ['_TRUNK', '_SPHERE', '_HALO', '_WAVES','_CLOUD']
const _TRUNK  = Symbol("TRUNK")
const _SPHERE = Symbol("SPHERE")
const _HALO   = Symbol("HALO")
const _WAVES  = Symbol("WAVES")
const _CLOUD  = Symbol("CLOUD")


export default {
  name: "audioVisualizations",
  data:()=>{
    return{
      animationType: '_DISABLE',
      visible: true,
      audioVizu:null,
      _box:null,
      _wrap:null,
      anf: null,
      fps_counter: 0,
    }
  },
  watch: {

  },
  mounted() {

    if(this._isPlayerVisible){
      this.setupCanvas();
      this.updateCanvas();
    }
    this.$root.$on('selectAnimationType', data => {
      console.log("on selectAnimationType:"+data);
      this.animationTypeSelect(data)
    });

    
  },
  computed:{
    _isPlayerVisible(){
      return !(document.querySelector( '#player-wrap' ))
    },
  },
  methods:{
    animationTypeSelect (animationTypeSel) {
      // if(!animationsType.includes(animationTypeSel)) return;
      this.animationDestroy()
      this.animationType = animationTypeSel;
      console.log("animationTypeSelect:" ); console.log(animationTypeSel)
      this.setupCanvas();
      this.updateCanvas();
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
        el: document.querySelector( '#canvas-animation' ),
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: this._box.height ,
        minWidth: this._box.width,
        color: 0x1496dc,
        scale: 1.00,
        backgroundColor: 0,
        cloudColor: 0xe1ca,
        lightColor: 0xe69191,
        texturePath: "img/noise.png",
        speed: 2.30,
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
        case '_CLOUD' :
          this.audioVizu = CLOUDS2(vantaOptions)
          break;
        case '_SPHERE':
          //this.audioVizu = _scene
          //this.audioVizu.setupCanvas();
          break;
      }
    },
    updateSize(){
      if (this._isSphere() || this.audioVizu==null) return;
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
      let chaos  = trunkNum(0.5,10,freq[ 1 ]|0)
      // let chaos  = trunkNum(0.5,10,freq[ 1 ]|0)
      let spacing  =trunkNum(0.2,7,freq[ 16 ]|0)
      this.audioVizu.setOptions({
         spacing:spacing,
         chaos:chaos,
         //color:color
     });
      },
     updateCanvasWaves(freq){

     let waveHeight  = trunkNum(2,40,freq[ 1 ]|0);
     let shininess = trunkNum(3,100,freq[ 16 ]|0)
     let waveSpeed = trunkNum(0.2,1.7,freq[ 3 ]|0)
     let zoom = trunkNum(0.7,1.8,freq[ 16 ]|0)

     this.audioVizu.setOptions({
       shininess: shininess,
       waveHeight: waveHeight,
       waveSpeed: waveSpeed,
       zoom: zoom,
     });
     },
    updateCanvaHalo(freq){
      //Halo
      let size = trunkNum(0.2,2,freq[ 1 ]|0);
      let amplitudeFactor  = trunkNum(0,3,freq[ 50 ]|0);
      let xOffset = trunkNum(-0.4,0.3,freq[ 200 ]|0);

      this.audioVizu.setOptions({
        size:size,
        amplitudeFactor:amplitudeFactor,
        xOffset: xOffset
      });
     },
    updateCanvaCloud(freq){
      //Halo
      let sunColor = ( Math.floor( freq[ 1 ] | 0 ) / 255 );
      let sunGlareColor  = Math.floor( freq[ 16 ] | 0 ) ;
      let speed = trunkNum(0,2.5,freq[ 16 ] | 0); ;
      let color = (Math.floor( freq[ 1 ] | 0 ) / 255 ) * (Math.floor( freq[ 16 ] | 0 ) / 255) * (Math.floor( freq[ 10] | 0 ) / 255) ;

      this.audioVizu.setOptions({
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.00,
        texturePath: "img/noise.png",
        skyColor: 0x287faa,
        cloudColor: 0x46577a,
        speed: 1.5
      });
     },
    
    //TODO:  setup a timer to update fps count and drop it down to 10fps for devices with slow compute resources
    frame_limit(){
      this.fps_counter++;
      if(this.fps_counter < 25 ) return false;
      this.fps_counter = 0;
      return true;
    },
    updateCanvas(now) {
      if ( !this.visible || _audio._gain === 0 || this.audioVizu === null) return;
      this.anf = requestAnimationFrame( this.updateCanvas );


      const freq = _audio.getFreqData();
      // if(this._isSphere() ) {
      //   this.audioVizu.updateObjects( freq );
      // }else {  // }
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
        case '_CLOUD':
          this.updateCanvaCloud(freq);
          break;
        case '_DISABLE':
        default:
          this.animationDestroy()
           this.audioVizu =null;
          return;
          break;
      }
    },
    animationDestroy(){
      if (this.audioVizu) {
        this.audioVizu.destroy()
        this.audioVizu = null
      }
    },

  },
  beforeDestroy() {
    this.animationDestroy()
  }

}
</script>

<style scoped>
#canvas-animation{
  position: absolute;
  top: 0px;
}
</style>