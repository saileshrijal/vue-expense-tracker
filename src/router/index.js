import { createRouter, createWebHistory } from "vue-router";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import Home from "../views/Home.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta:{
            auth : true
        }
    },
    {
        path: "/Login",
        name: "Login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/Register",
        name: "Register",
        component: () => import("../views/Register.vue"),
    },
    {
        path: "/Statement",
        name: "Statement",
        component: () => import("../views/Statement.vue"),
        meta:{
            auth : true
        }
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

router.beforeEach(async (to, from, next) => {
    if(to.matched.some(record => record.meta.auth)){
        if(await getCurrentUser()){
            next()
        }else{
            next({name: 'Login'})
        }
    }
    else if(to.matched.some(record => record.name == 'Login' || record.name == 'Register')){
        if(await getCurrentUser()){
            next({name: 'Home'})
        }else{
            next();
        }
    }else{
        next();
    }
})

export default router;