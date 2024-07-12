function getAllLiabilities(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/liabilities', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.liabilityList;
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
        .put(`/ops/liabilities/${editedLiability.id}`, editedLiability, {
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

function deleteLiability(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/liabilities/${id}`, { signal: controller.signal })
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
