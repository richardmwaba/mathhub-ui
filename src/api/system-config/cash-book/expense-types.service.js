function getAllExpenseTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/expenseTypes', { signal: controller.signal })
        .then((response) => {
            let expenseTypes = [];

            const expenseTypesList = response.data._embedded.expenseTypeDtoList;

            expenseTypes = expenseTypesList.map((expenseType) => {
                return {
                    id: expenseType.expenseTypeId,
                    type: expenseType.typeName,
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

const ExpenseTypesService = { getAllExpenseTypes };

export default ExpenseTypesService;
