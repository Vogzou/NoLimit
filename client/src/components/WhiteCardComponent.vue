<template>
    <div class="white-card">
      <p>{{card ? card.Description : 'Pas de carte'}}</p>
    </div>
</template>
<script setup lang="ts">
import type {Card} from "@/models/Card";

const props = defineProps<{
  card ? : Card;
}>();
</script>

<style scoped>

.white-card {
  background-color: #FFFFFF;
  height: 240px;
  width: 180px;
  border-radius: 10px;
  transform: translateY(0);
  transition: ease-out 0.2s;
  margin: 0 0.5em 0 0.5em;
}

.white-card:hover{
  transform: translateY(-10px);
}

p{
  padding-top: 1rem;
  text-align: center;
  color: black;
}

</style>
