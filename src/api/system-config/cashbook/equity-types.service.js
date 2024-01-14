function getAllEquityTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/equityTypes', { signal: controller.signal })
        .then((response) => {
            let equityTypes = [];

            const equityTypesList = response.data._embedded.equityTypeDtoList;

            equityTypes = equityTypesList.map((equityType) => {
                return {
                    id: equityType.equityTypeId,
                    type: equityType.typeName,
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

const EquityTypesService = { getAllEquityTypes };

export default EquityTypesService;
