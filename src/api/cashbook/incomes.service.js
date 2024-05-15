function getAllIncomes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/incomes', { signal: controller.signal })
        .then((response) => {
            let incomes = [];

            const incomesList = response.data._embedded.incomeList;

            incomes = incomesList.map((income) => {
                return {
                    id: income.incomeId,
                    paymentMethod: income.paymentMethod,
                    narration: income.narration,
                    incomeType: income.incomeType,
                    amount: income.amount,
                    createdBy: income.createdBy,
                };
            });

            return incomes;
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
        .put(`/ops/incomes/${editedIncome.incomeId}`, editedIncome, {
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

function deleteIncome(incomeId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/incomes/${incomeId}`, { signal: controller.signal })
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
