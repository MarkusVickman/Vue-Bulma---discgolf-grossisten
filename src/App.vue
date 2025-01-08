<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

</script>

<!-- Läser in header och footer komponenten samt aktuellt vald routervy -->
<template>
  <!--Container för att hålla footern på plats-->
  <div class="page-container">
    <div class="page-height-without-footer">
      <TheHeader />
      <RouterView />
    </div>
    <TheFooter />
  </div>
</template>

<script>

</script>

<style scoped>

/*För att footern ska fungera på ett bra sätt*/
.page-container {
    position: relative;
    min-height: 100vh;
}

/*För att footern ska fungera på ett bra sätt*/
.page-height-without-footer {
    padding-bottom: 10rem;
    min-height: 100vh;
    margin-bottom: -150px;
}

footer {
  height: 150px;
}

</style>