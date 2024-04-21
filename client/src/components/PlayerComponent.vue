<template>
  <div class="player" :class="{'current-player' : isCurrentPlayer}">
    <h2>{{ player }}</h2>
  </div>
</template>

<style scoped>
.current-player{
  color: #1B998B;
}

.player{
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>
<script setup lang="ts">
const props = defineProps<{
  player : string;
  isCurrentPlayer : boolean;
}>();
</script>
