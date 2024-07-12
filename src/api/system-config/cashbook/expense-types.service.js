function getAllExpenseTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/expenseTypes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.expenseTypeList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createExpenseType(newExpenseType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/expenseTypes', newExpenseType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editExpenseType(editedExpenseType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(
            `/systemconfig/ops/expenseTypes/${editedExpenseType.id}`,
            editedExpenseType,
            {
                signal: controller.signal,
            },
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const ExpenseTypesService = { createExpenseType, editExpenseType, getAllExpenseTypes };

export default ExpenseTypesService;
