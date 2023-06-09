<template>
  <form @submit.prevent="$emit('critere', motcle)">
    <p>Rechercher des livres</p>
    <input
      class="btn"
      type="text"
      v-model="motcle"
      placeholder="Le critère"
      required
    />
    <input type="submit" value="Valider" class="btn" />
  </form>
</template>
<script setup>
import { ref } from "vue";
const motcle = ref("");
</script>