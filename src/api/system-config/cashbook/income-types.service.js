function getAllIncomeTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/incomeTypes', { signal: controller.signal })
        .then((response) => {
            let incomeTypes = [];

            const incomeTypesList = response.data._embedded.incomeTypeDtoList;

            incomeTypes = incomeTypesList.map((incomeType) => {
                return {
                    id: incomeType.incomeTypeId,
                    name: incomeType.typeName,
                    description: incomeType.typeDescription,
                };
            });

            return incomeTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createIncomeType(newIncomeType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/incomeTypes', newIncomeType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editIncomeType(editedIncomeType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/ops/incomeTypes/${editedIncomeType.incomeTypeId}`, editedIncomeType, {
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

const IncomeTypesService = { createIncomeType, editIncomeType, getAllIncomeTypes };

export default IncomeTypesService;
