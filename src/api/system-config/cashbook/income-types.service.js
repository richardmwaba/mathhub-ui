function getAllIncomeTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/incomeTypes', { signal: controller.signal })
        .then((response) => {
            let incomeTypes = [];

            const incomeTypesList = response.data._embedded.incomeTypeDtoList;

            incomeTypes = incomeTypesList.map((incomeType) => {
                return {
                    id: incomeType.incomeTypeId,
                    type: incomeType.typeName,
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

const IncomeTypesService = { getAllIncomeTypes };

export default IncomeTypesService;
