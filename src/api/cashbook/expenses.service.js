function getAllExpenses(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/expenses', { signal: controller.signal })
        .then((response) => {
            let expenses = [];

            const expensesList = response.data._embedded.expenseList;

            expenses = expensesList.map((expense) => {
                return {
                    id: expense.expenseId,
                    paymentMethod: expense.paymentMethod,
                    narration: expense.narration,
                    expenseType: expense.expenseType,
                    amount: expense.amount,
                    createdBy: expense.createdBy,
                };
            });

            return expenses;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createExpense(newExpense, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/expenses', newExpense, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editExpense(editedExpense, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/expenses/${editedExpense.expenseId}`, editedExpense, {
            signal: controller.signal,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function deleteExpense(expenseId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/expenses/${expenseId}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const ExpensesService = { createExpense, deleteExpense, editExpense, getAllExpenses };

export default ExpensesService;
