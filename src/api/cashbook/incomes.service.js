function getAllIncomes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/incomes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.incomeList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createIncome(newIncome, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/incomes', newIncome, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editIncome(editedIncome, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/incomes/${editedIncome.id}`, editedIncome, {
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

function deleteIncome(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/incomes/${id}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const IncomesService = { createIncome, deleteIncome, editIncome, getAllIncomes };

export default IncomesService;
