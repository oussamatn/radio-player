<template>
    <select name="animation" v-model="animationTypeSelect">
      <option disabled value="">Choose animation</option>
      <option value="_TRUNK">TRUNK</option>
<!--      <option value="_SPHERE">SPHERE</option>-->
      <option value="_HALO">HALO</option>
      <option value="_WAVES">WAVES</option>
      <option value="_CLOUD">CLOUD</option>
      <option value="_DISABLE">DISABLE</option>
    </select>
</template>

<script>
export default {
  name: "animationSelection",
  data: ()=>{
    return{
      animationTypeSelect:''
    }
  },
  watch: {
    animationTypeSelect() {
      this.$root.$emit('selectAnimationType', this.animationTypeSelect);
    }
  }
}
</script>

<style scoped>

</style>