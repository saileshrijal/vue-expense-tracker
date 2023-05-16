<template>
    <div class="flex justify-between items-center py-4">
        <h1 class="text-white">
            <font-awesome-icon icon="fa-solid fa-user-secret" /> Hi, {{ auth.currentUser.email }}!
        </h1>
        <div>
            <RouterLink to="/statement" class="bg-white p-1 px-2 text-red-600 rounded-md">
                <font-awesome-icon icon="fa-solid fa-file" />
            </RouterLink>
            <button class="bg-red-600 p-2 text-white rounded-md ms-2" @click="logout">
                <font-awesome-icon icon="fa-solid fa-sign-out" />
            </button>
        </div>
    </div>
    <hr>
    <div class="flex gap-2 justify-between py-4">
        <div class="bg-yellow-400 p-2 px-4 rounded-md shadow-md">
            <h4 class="text-xl">Expenses</h4>
            <p>Rs. {{ expense }}</p>
        </div>
        <div class="bg-green-400 p-2 px-4 rounded-md shadow-md">
            <h4 class="text-xl">Income</h4>
            <p>Rs. {{ income }}</p>
        </div>
        <div class="bg-purple-300 p-2 px-4 rounded-md shadow-md">
            <h4 class="text-xl">Balance</h4>
            <p>Rs. {{ balance }}</p>
        </div>
    </div>
    <hr>
    <div class="p-4 bg-white rounded-md shadow-lg my-4">
        <form class="flex flex-col gap-2" @submit.prevent="addTransaction">
            <input type="text" placeholder="Title" class="p-2 rounded-md shadow-md" v-model="title">
            <div class="flex gap-2">
                <select class="p-2 rounded-md shadow-md w-full" v-model="type">
                    <option value="">Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <input type="number" placeholder="Amount" class="p-2 rounded-md shadow-md w-full" v-model="amount">
            </div>
            <button class="bg-purple-600 p-2 text-white rounded-md shadow-md">
                <font-awesome-icon icon="fa-solid fa-add" /> Add Transaction
            </button>
        </form>
    </div>
    <hr>
    <div class="p-4 bg-white rounded-md shadow-lg mt-4">
        <h2 class="text-purple-600">Today's Transactions</h2>
        <hr>
        <div class="flex justify-between my-4" v-for="transaction in transactions" :key="transaction.id">
            <h4 class="">{{ transaction.title }}</h4>
            <p :class="transaction.type == 'income' ? 'text-green-600' : 'text-yellow-500'"><span
                    v-if="transaction.type == 'income'">&plus;</span> <span
                    v-if="transaction.type == 'expense'">&minus;</span> Rs. {{ transaction.amount }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '../router';
import { getAuth, signOut } from '@firebase/auth';
import { collection, addDoc, onSnapshot, query, where, orderBy } from '@firebase/firestore';
import db from '../firebase'

const title = ref('');
const type = ref('');
const amount = ref('');
const balance = ref(0);
const income = ref(0);
const expense = ref(0);

const transactions = ref([])

onMounted(() => {
    const q = query(collection(db, "transactions"), where("userId", "==", auth.currentUser.uid),
    where("createdAt", ">=", new Date().setHours(0,0,0,0)),
    where("createdAt", "<=", new Date().setHours(23,59,59,999)),
    orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapchat) => {
        income.value = 0
        expense.value = 0
        const fbTransactions = []
        querySnapchat.forEach((doc) => {
            const transaction = {
                id: doc.id,
                title: doc.data().title,
                type: doc.data().type,
                amount: doc.data().amount,
                createdAt: doc.data().createdAt
            }
            fbTransactions.push(transaction)
            if (transaction.type == 'income')
                income.value += parseInt(transaction.amount)
            else
                expense.value += parseInt(transaction.amount)

        })
        transactions.value = fbTransactions
        getBalance();
    });
})


const validate = () => {
    if (title.value === '') {
        alert('Please enter title')
        return false
    }
    if (type.value === '') {
        alert('Please select type')
        return false
    }
    if (amount.value === '') {
        alert('Please enter amount')
        return false
    }
    return true
}

const addTransaction = () => {
    if (!validate())
        return;

    try {
        addDoc(collection(db, "transactions"), {
            title: title.value,
            type: type.value,
            amount: amount.value,
            createdAt: Date.now(),
            userId: auth.currentUser.uid
        });

        title.value = ''
        type.value = ''
        amount.value = ''

    }
    catch (e) {
        console.log(e)
    }
}
const auth = getAuth();

const logout = async () => {
    await signOut(auth);
    router.push('/login')
}

const getBalance = () => {
    balance.value = income.value - expense.value
}

</script>

