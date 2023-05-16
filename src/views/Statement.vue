<template>
    <div class="flex justify-between items-center py-4">
        <h1 class="text-white">
            Statement
        </h1>
        <div>
            <RouterLink to="/" class="bg-red-600 p-1 px-2 text-white rounded-md ms-2">
                <font-awesome-icon icon="fa-solid fa-arrow-left" /> 
            </RouterLink>
        </div>
    </div>
    <hr>
    <div class="p-4 bg-white rounded-md shadow-lg my-4">
        <form @submit.prevent="filter" class="flex flex-col gap-2">
            <div class="flex gap-2">
                <div class="w-full">
                    <label for="">From</label>
                    <input type="date" placeholder="Amount" class="p-2 rounded-md shadow-md w-full" v-model="fromDate">
                </div>
                <div class="w-full">
                    <label for="">To</label>
                    <input type="date" placeholder="Amount" class="p-2 rounded-md shadow-md w-full" v-model="toDate">
                </div>

            </div>
            <button class="bg-purple-600 p-2 text-white rounded-md shadow-md">
                Filter
            </button>
        </form>
    </div>
    <hr>
    <div class="flex gap-2 justify-between py-4" :class="transactions.length > 0 ? 'block' : 'hidden'">
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
    <div class="p-4 bg-white rounded-md shadow-lg mt-4" :class="transactions.length > 0 ? 'block' : 'hidden'">
        <canvas id="myChart"></canvas>
    </div>
    <hr>
    <div class="p-4 bg-white rounded-md shadow-lg mt-4" :class="transactions.length > 0 ? 'block' : 'hidden'">
        <h2 class="text-purple-600">Transactions</h2>
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
import { getAuth } from '@firebase/auth';
import db from '../firebase';
import { collection, query, orderBy, where, getDocs } from '@firebase/firestore';
import { ref } from 'vue'
import Chart from 'chart.js/auto'

const fromDate = ref(new Date().toISOString().slice(0, 10));

const toDate = ref(new Date().toISOString().slice(0, 10));

const transactions = ref([]);

const auth = getAuth()

const income = ref(0);
const expense = ref(0);
const balance = ref(0);


const filter = async () => {
    income.value = 0;
    expense.value = 0;
    const q = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid), where('createdAt', '>=', new Date(fromDate.value).setHours(0, 0, 0, 0)), where('createdAt', '<=', new Date(toDate.value).setHours(23, 59, 59, 999)), orderBy('createdAt', 'desc'));
    const querySnapchat = await getDocs(q);
    const fbTransactions = [];
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

    });
    transactions.value = fbTransactions;
    getBalance();
    getChart();
}

const getBalance = () => {
    balance.value = income.value - expense.value
}


const getChart = () => {

    //calculate date sequence
    const dateSequence = [];
    const startDate = new Date(fromDate.value);
    const endDate = new Date(toDate.value);
    const dateMove = new Date(startDate);
    let strDate = startDate.toISOString().slice(0, 10);
    while (strDate <= endDate.toISOString().slice(0, 10)) {
        dateSequence.push(strDate);
        dateMove.setDate(dateMove.getDate() + 1);
        strDate = dateMove.toISOString().slice(0, 10);
    };

    //calculate income and expense
    const income = [];
    const expense = [];


    dateSequence.forEach((date) => {
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.value.forEach((transaction) => {
            if (new Date(transaction.createdAt).toISOString().slice(0, 10) == date) {
                if (transaction.type == 'income') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpense += transaction.amount;
                }
            }
        });
        income.push(totalIncome);
        expense.push(totalExpense);
    });



    //chart

    const labels = dateSequence;

    const data = {
        labels: labels,
        datasets: [{
            label: 'Income',
            data: income,
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        },
        {
            label: 'Expense',
            data: expense,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

}

</script>