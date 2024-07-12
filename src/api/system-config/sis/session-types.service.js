function getAllSessionTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/sessionTypes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.sessionTypeList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createSessionType(sessionType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/sis/sessionTypes', sessionType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editSessionType(sessionType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/sis/sessionTypes/${sessionType.id}`, sessionType, {
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

const SessionTypeService = { createSessionType, editSessionType, getAllSessionTypes };

export default SessionTypeService;
