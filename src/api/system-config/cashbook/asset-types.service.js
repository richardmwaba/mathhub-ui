function getAllAssetTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/assetTypes', { signal: controller.signal })
        .then((response) => {
            let assetTypes = [];

            const assetTypesList = response.data._embedded.assetTypeDtoList;

            assetTypes = assetTypesList.map((assetType) => {
                return {
                    id: assetType.assetTypeId,
                    name: assetType.typeName,
                    description: assetType.typeDescription,
                };
            });

            return assetTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createAssetType(newAssetType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/assetTypes', newAssetType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editAssetTypeForm(editedAssetType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/ops/assetTypes/${editedAssetType.assetTypeId}`, editedAssetType, {
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

const AssetTypesService = { createAssetType, editAssetTypeForm, getAllAssetTypes };

export default AssetTypesService;
