import { db } from '../mockData/db';

export const financeService = {
    getSummary: () => {
        return {
            revenue: db.data.finance.revenue,
            expenses: db.data.finance.expenses,
            balance: db.data.finance.revenue - db.data.finance.expenses
        };
    },

    getTransactions: () => {
        return db.data.finance.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    addExpense: (amount, description) => {
        const expense = {
            id: 'tx_exp_' + Date.now(),
            type: 'debit',
            amount: Number(amount),
            description,
            date: new Date().toISOString()
        };

        db.data.finance.expenses += Number(amount);
        db.data.finance.transactions.push(expense);

        db.data.auditLogs.push({
            id: Date.now().toString(),
            action: 'ADD_EXPENSE',
            transactionId: expense.id,
            timestamp: new Date().toISOString()
        });

        db.save();
        return expense;
    },

    getMonthlyData: () => {
        // Generate mock mock data for charts based on current totals
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const { revenue, expenses } = db.data.finance;

        // Distribute roughly towards current date
        const currentMonth = new Date().getMonth();

        return months.map((month, index) => {
            if (index > currentMonth) return { name: month, Income: 0, Expense: 0 };

            // Random generation around an average
            const avgInc = revenue / (currentMonth + 1);
            const avgExp = expenses / (currentMonth + 1);

            return {
                name: month,
                Income: index === currentMonth ? avgInc * 1.5 : (Math.random() * 0.4 + 0.8) * avgInc,
                Expense: index === currentMonth ? avgExp * 0.5 : (Math.random() * 0.4 + 0.8) * avgExp,
            };
        });
    }
};
