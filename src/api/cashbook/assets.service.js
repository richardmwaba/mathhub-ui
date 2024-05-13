function getAllAssets(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/assets', { signal: controller.signal })
        .then((response) => {
            let assets = [];

            const assetsList = response.data._embedded.assetList;

            assets = assetsList.map((asset) => {
                return {
                    id: asset.assetId,
                    paymentMethod: asset.paymentMethod,
                    narration: asset.narration,
                    assetType: asset.assetType,
                    amount: asset.amount,
                    createdBy: asset.createdBy,
                };
            });

            return assets;
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
        .put(`/ops/assets/${editedAsset.assetId}`, editedAsset, {
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

function deleteAsset(assetId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/assets/${assetId}`, { signal: controller.signal })
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
