<template>
  <div class="tab">
    <div class="player-info">
      <p>{{ player.Name }}</p>
      <p class="subText">{{ player.IsAdmin }}</p>
    </div>
    <div class="player-kick">
      <button>Kick</button>
    </div>
  </div>
</template>

<style scoped>
.tab{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.50);

  .player-kick button{
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-background-secondary-game);
  }
}
</style>
<script setup lang="ts">
import type {Player} from "@/models/Player";
const props = defineProps<{
  player : Player;
}>();
</script>
