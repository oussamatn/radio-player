<template>
    <button class="favBtn" @click.stop="$emit( 'change', id, !active )">
        <i v-if="active" class="fa fa-heart text-primary fx fx-drop-in" key="on"></i>
        <i v-else class="fa fa-heart-o fx fx-drop-in" key="off"></i>
    </button>
</template>

<script>
    export default {
        name: 'favBtn',
        props: {
            id: { type: Number, default: '', required: true },
            active: { type: Boolean, default: false },
        }
    }
</script>