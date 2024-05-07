function getAllEquityTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/equityTypes', { signal: controller.signal })
        .then((response) => {
            let equityTypes = [];

            const equityTypesList = response.data._embedded.equityTypeList;

            equityTypes = equityTypesList.map((equityType) => {
                return {
                    id: equityType.equityTypeId,
                    name: equityType.typeName,
                    description: equityType.typeDescription,
                };
            });

            return equityTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createEquityType(newEquityType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/equityTypes', newEquityType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editEquityType(editedEquityType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/ops/equityTypes/${editedEquityType.equityTypeId}`, editedEquityType, {
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

const EquityTypesService = { createEquityType, editEquityType, getAllEquityTypes };

export default EquityTypesService;
