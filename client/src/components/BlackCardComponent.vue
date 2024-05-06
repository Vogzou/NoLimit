<template>
  <div class="black-card">
    <p>{{card.Description}}</p>
    <p>______</p>
  </div>
</template>

<style scoped>

.black-card {
  background-color: black;
  height: 300px;
  width: 240px;
  border-radius: 10px;
}

p{
  padding-top: 1rem;
  text-align: center;
}

</style>
<script setup lang="ts">
import type {Card} from "@/models/Card";

const props = defineProps<{
  card : Card;
}>();
</script>
