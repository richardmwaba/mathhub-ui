function getAllExpenseTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/expenseTypes', { signal: controller.signal })
        .then((response) => {
            let expenseTypes = [];

            const expenseTypesList = response.data._embedded.expenseTypeDtoList;

            expenseTypes = expenseTypesList.map((expenseType) => {
                return {
                    id: expenseType.expenseTypeId,
                    name: expenseType.typeName,
                    description: expenseType.typeDescription,
                };
            });

            return expenseTypes;
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
            `/systemconfig/ops/expenseTypes/${editedExpenseType.expenseTypeId}`,
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
