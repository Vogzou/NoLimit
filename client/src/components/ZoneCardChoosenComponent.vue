<template>
  <div class="zone-card">
    <WhiteCardComponent :card="card"></WhiteCardComponent>
  </div>
</template>

<style scoped>

.zone-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  min-width: 215px;
  border: 4px dashed var(--color-background-ter-game);
  border-radius: 10px;
}

</style>
<script setup lang="ts">
import WhiteCardComponent from "@/components/WhiteCardComponent.vue";
import type {Card} from "@/models/Card";
const props = defineProps<{
  card ? : Card;
}>();
</script>
