function getAllLiabilityTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/liabilityTypes', { signal: controller.signal })
        .then((response) => {
            let liabilityTypes = [];

            const liabilityTypesList = response.data._embedded.liabilityTypeDtoList;

            liabilityTypes = liabilityTypesList.map((liabilityType) => {
                return {
                    id: liabilityType.liabilityTypeId,
                    name: liabilityType.typeName,
                    description: liabilityType.typeDescription,
                };
            });

            return liabilityTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createLiabilityType(newLiabilityType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/liabilityTypes', newLiabilityType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editLiabilityType(editedLiabilityType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(
            `/systemconfig/ops/liabilityTypes/${editedLiabilityType.liabilityTypeId}`,
            editedLiabilityType,
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

const LiabilityTypesService = { createLiabilityType, editLiabilityType, getAllLiabilityTypes };

export default LiabilityTypesService;
