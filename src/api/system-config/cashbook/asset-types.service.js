function getAllAssetTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/assetTypes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.assetTypeList;
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

function editAssetType(editedAssetType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/ops/assetTypes/${editedAssetType.id}`, editedAssetType, {
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

const AssetTypesService = { createAssetType, editAssetType, getAllAssetTypes };

export default AssetTypesService;
