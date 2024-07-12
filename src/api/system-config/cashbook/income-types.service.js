function getAllIncomeTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/incomeTypes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.incomeTypeList;
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
        .put(`/systemconfig/ops/incomeTypes/${editedIncomeType.id}`, editedIncomeType, {
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
