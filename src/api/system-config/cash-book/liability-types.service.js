function getAllLiabilityTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/liabilityTypes', { signal: controller.signal })
        .then((response) => {
            let liabilityTypes = [];

            const liabilityTypesList = response.data._embedded.liabilityTypeDtoList;

            liabilityTypes = liabilityTypesList.map((liabilityType) => {
                return {
                    id: liabilityType.liabilityTypeId,
                    type: liabilityType.typeName,
                    description: liabilityType.typeDescription,
                };
            });

            console.log(liabilityTypes);

            return liabilityTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const LiabilityTypesService = { getAllLiabilityTypes };

export default LiabilityTypesService;
