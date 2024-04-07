<template>
    <select name="animation" v-model="animationTypeSelect">
      <option disabled value="">{{$t('choose_animation')}}</option>
      <option value="_TRUNK">{{$t('trunk')}}</option>
<!--      <option value="_SPHERE">SPHERE</option>-->
      <option value="_HALO">{{$t('halo')}}</option>
      <option value="_WAVES">{{$t('waves')}}</option>
      <option value="_CLOUD">{{$t('cloud')}}</option>
      <option value="_DISABLE" selected>{{$t('disable')}}</option>
    </select>
</template>

<script>
import animationService from "@/services/animationService.js";
import emitter from 'tiny-emitter/instance'

export default {
  name: "animationSelection",
  data: ()=>{
    return{
      animationTypeSelect:''
    }
  },
  async created() {
    this.animationTypeSelect = await animationService.get();
    console.log("created : " + this.animationTypeSelect);
  },
  watch: {
    animationTypeSelect() {
      animationService.set(this.animationTypeSelect);
      emitter.emit('selectAnimationType', this.animationTypeSelect);
    }
  },
}
</script>

<style scoped>

</style>
