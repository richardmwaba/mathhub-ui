function getAllAssetTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/assetTypes', { signal: controller.signal })
        .then((response) => {
            let assetTypes = [];

            const assetTypesList = response.data._embedded.assetTypeDtoList;

            assetTypes = assetTypesList.map((assetType) => {
                return {
                    id: assetType.assetTypeId,
                    type: assetType.typeName,
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

const AssetTypesService = { getAllAssetTypes };

export default AssetTypesService;
