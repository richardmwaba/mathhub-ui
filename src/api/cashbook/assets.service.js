function getAllAssets(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/assets', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.assetList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createAsset(newAsset, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/assets', newAsset, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editAsset(editedAsset, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/assets/${editedAsset.id}`, editedAsset, {
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

function deleteAsset(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/assets/${id}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const AssetsService = { createAsset, deleteAsset, editAsset, getAllAssets };

export default AssetsService;
