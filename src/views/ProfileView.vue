<script setup>import ApiUser from '@/components/ApiUser.vue'; </script>
<template>
  <main>
    <!-- vanlig section med lite styling -->
    <section class="container section">
      <h1 class="title">Profilsidan</h1>
      <p class="subtitle">Se din profil eller ändra uppgifter.</p>
    </section>

    <!-- Laddar in component för profilsidan -->
    <ApiUser />

  </main>
</template>