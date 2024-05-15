function getAllLiabilities(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/liabilities', { signal: controller.signal })
        .then((response) => {
            let liabilities = [];

            const liabilitiesList = response.data._embedded.liabilityList;

            liabilities = liabilitiesList.map((liability) => {
                return {
                    id: liability.liabilityId,
                    paymentMethod: liability.paymentMethod,
                    narration: liability.narration,
                    liabilityType: liability.liabilityType,
                    amount: liability.amount,
                    createdBy: liability.createdBy,
                };
            });

            return liabilities;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createLiability(newLiability, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/liabilities', newLiability, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editLiability(editedLiability, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/liabilities/${editedLiability.liabilityId}`, editedLiability, {
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

function deleteLiability(liabilityId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/liabilities/${liabilityId}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const LiabilitiesService = { createLiability, deleteLiability, editLiability, getAllLiabilities };

export default LiabilitiesService;
