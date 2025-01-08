import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

//Deklarerar routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',     //Startsidansroute
      name: 'start',
      component: HomeView,
      meta: {
        requiresAuth: false // Indikerar att den inte behöver kontrolleras med requireAuth
      }
    },
    {
      path: '/inventorie',   //Lagersidans route
      name: 'Lagret',
      component: () => import('../views/InventorieView.vue'),
      meta: {
        requiresAuth: true // Indikerar att den behöver kontrolleras med requireAuth
      }
    },
    {
      path: '/profile', //Profilsidans route
      name: 'Profil',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true // Indikerar att den behöver kontrolleras med requireAuth
      }
    },
  ],
})

//Innen dirigering testas om användaren har en token (vidare kontroll görs i headern)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      next();
    } else {
      next('/');
    }
  } else {
    // För icke skyddade routes ges access
    next();
  }
});

export default router
