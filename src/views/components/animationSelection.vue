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
import animatinoService from "@/services/animatinoService";
export default {
  name: "animationSelection",
  data: ()=>{
    return{
      animationTypeSelect:''
    }
  },
  async created() {
    this.animationTypeSelect = await animatinoService.get();
    console.log("created : " + this.animationTypeSelect);
  },
  watch: {
    animationTypeSelect() {
      animatinoService.set(this.animationTypeSelect);
      this.$root.$emit('selectAnimationType', this.animationTypeSelect);
    }
  },
}
</script>

<style scoped>

</style>