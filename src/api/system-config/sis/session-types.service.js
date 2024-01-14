function getAllSessionTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/sessionTypes', { signal: controller.signal })
        .then((response) => {
            let sessionTypes = [];

            const sessionTypesList = response.data._embedded.sessionTypeDtoList;

            sessionTypes = sessionTypesList.map((sessionType) => {
                return {
                    id: sessionType.sessionTypeId,
                    type: sessionType.typeName,
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

const SessionTypeService = { getAllSessionTypes };

export default SessionTypeService;
