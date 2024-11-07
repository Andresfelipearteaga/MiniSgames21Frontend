import { createRouter, createWebHistory } from "vue-router";
// import axios from 'axios';
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Content from "../views/Content.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
    // meta: {
    //   requiresAuth: true, // Requerir autenticación para acceder a esta ruta
    // },
  },
  {
    path: "/content",
    name: "Content",
    component: Content,
    // meta: {
    //   requiresAuth: true, // Requerir autenticación para acceder a esta ruta
    // },
  },

  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    // meta: {
    //   requiresAuth: true, // Requerir autenticación para acceder a esta ruta
    // },
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

// router.beforeEach(async (to, from, next) => {
//   // Verificar si la ruta requiere autenticación
//   if (to.meta.requiresAuth) {
//     try {
//       // Llama a la ruta de verificación de token en el backend
//       const response = await axios.get('http://localhost:5000/api/auth/protect', { withCredentials: true });
//       console.log('Before');
//       // Si el token es válido, permitir el acceso a la ruta
//       if (response.status === 200) {
//         console.log('Token válido, permitiendo el acceso a la ruta');
//         next(); // Permitir el acceso
//       } else {
//         // Si la respuesta no es 200, redirigir al login
//         console.log('Token inválido, redirigiendo al login');
//         next({ name: 'Signin' });
//       }
//     } catch (error) {
//       // Si el token es inválido o expiró, redirigir al login
//       if (error.response && error.response.status === 401) {
//         console.log('Token inválido, redirigiendo al login');
//         next({ name: 'Signin' });
//       } else {
//         console.error('Error al verificar la autenticación:', error);
//         next(); // En caso de otro error, continuar sin restricciones
//       }
//     }
//   } else {
//     // Si la ruta no requiere autenticación, continuar normalmente
//     next();
//   }
// });


export default router;
