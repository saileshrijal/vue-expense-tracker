<template>
    <div class="flex justify-center items-center py-4">
        <h1 class="text-white text-2xl">
            Register
        </h1>
    </div>
    <hr>
    <form @submit.prevent="register">
        <div class="p-4 bg-white rounded-md shadow-lg my-4">
            <div class="mb-3">
                <label for="" class="block">Email</label>
                <input type="email" class="p-2 rounded-md shadow-md w-full" v-model="email" required>
            </div>
            <div class="mb-3">
                <label for="" class="block">Password</label>
                <input type="password" class="p-2 rounded-md shadow-md w-full" v-model="password" required>
            </div>
            <div class="mb-3">
                <button class="bg-purple-600 p-2 text-white rounded-md shadow-md w-full">Register</button>
            </div>
            <p class="mt-4 text-center">Already have an account? <RouterLink to="/login">Login Here</RouterLink>!</p>
        </div>
    </form>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import router from "../router";
import { ref } from "vue";

const email = ref("");
const password = ref("");

const auth = getAuth();


const register = async () => {
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log(user);
        router.push("/login");
    }
    catch(err){
        console.log(err);
    }
}


</script>