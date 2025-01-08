<script setup>
import ApiDiscs from '@/components/ApiDiscs.vue';
</script>

<template>
  <!-- vanlig section med lite styling -->
  <section class="container section">
    <h1 class="title">Discgolf-lagret</h1>
    <p class="subtitle">Vårat centrallager</p>
  </section>

  <!-- Laddar in component för Discsidan -->
  <ApiDiscs />

  </template>
  