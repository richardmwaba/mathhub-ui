function getAllExpenses(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/expenses', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.expenseList;
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
        .put(`/ops/expenses/${editedExpense.id}`, editedExpense, {
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

function deleteExpense(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/expenses/${id}`, { signal: controller.signal })
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
