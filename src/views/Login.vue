<template>
    <div class="">
        <div class="flex justify-center items-center py-4">
            <h1 class="text-white text-2xl">
                Login
            </h1>
        </div>
        <hr>
        <div class="p-4 bg-white rounded-md shadow-lg my-4">
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="" class="block">Email</label>
                    <input type="email" class="p-2 rounded-md shadow-md w-full" v-model="email"  placeholder="Enter Email">
                </div>
                <div class="mb-3">
                    <label for="" class="block">Password</label>
                    <input type="password" class="p-2 rounded-md shadow-md w-full" v-model="password"  placeholder="Enter Password">
                </div>
                <div class="mb-3">
                    <button class="bg-purple-600 p-2 text-white rounded-md shadow-md w-full">Sign In</button>
                </div>
            </form>
            <p class="my-4 text-center">Dont have an account? <RouterLink to="/register">Register Here</RouterLink>!</p>
            <p class="text-center">OR</p>
            <button class="w-full text-center bg-red-500 text-white p-2 rounded-lg mt-4" @click="signInWithGoogle">SignIn With Google</button>
            <button class="w-full text-center bg-blue-600 text-white p-2 rounded-lg mt-4" @click="signInWithFacebook">SignIn With Facebook</button>
        </div>
    </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import router from "../router";
import { ref } from "vue";
const email = ref("");
const password = ref("");

const auth = getAuth();

const login = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log(user);
        router.push("/");
    }
    catch (err) {
        console.log(err);
    }
}


const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(getAuth(), provider);
    console.log(response.user);
    router.push("/");
}

const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const response = await signInWithPopup(getAuth(), provider);
    console.log(response.user);
    router.push("/");
}

</script>