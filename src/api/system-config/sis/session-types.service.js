function getAllSessionTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/sessionTypes', { signal: controller.signal })
        .then((response) => {
            let sessionTypes = [];

            const sessionTypesList = response.data._embedded.sessionTypeList;

            sessionTypes = sessionTypesList.map((sessionType) => {
                return {
                    id: sessionType.sessionTypeId,
                    name: sessionType.typeName,
                    description: sessionType.typeDescription,
                };
            });

            return sessionTypes;
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
        .put(`/systemconfig/sis/sessionTypes/${sessionType.sessionTypeId}`, sessionType, {
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
