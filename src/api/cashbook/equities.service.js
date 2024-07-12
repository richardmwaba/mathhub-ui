function getAllEquity(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/equity', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.equityList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createEquity(newEquity, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/equity', newEquity, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editEquity(editedEquity, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/equity/${editedEquity.id}`, editedEquity, {
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

function deleteEquity(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/equity/${id}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const EquitiesService = { createEquity, deleteEquity, editEquity, getAllEquity };

export default EquitiesService;
