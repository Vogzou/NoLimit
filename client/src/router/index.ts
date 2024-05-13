import { createRouter, createWebHistory } from 'vue-router'
import BoardView from "@/views/BoardView.vue";
import HomeView from "@/views/HomeView.vue";
import LobbyView from "@/views/LobbyView.vue";
import RoundStatView from "@/views/RoundStatView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game-board/:roomId/:socketId',
      name: 'board',
      component: BoardView,
      props : {
        roomId : String,
        socketId : String
      }
    },
    {
      path: '/lobby/:roomId/:socketId',
      name: 'lobby',
      component: LobbyView,
      props : {
        roomId : String,
        socketId : String
      }
    },
    {
      path: '/round/:roomId/:socketId',
      name: 'round',
      component: RoundStatView,
      props : {
        roomId : String,
        socketId : String
      }
    }
  ]
})

export default router
