function getAllEquity(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/equity', { signal: controller.signal })
        .then((response) => {
            let equities = [];

            const equityList = response.data._embedded.equityList;

            equities = equityList.map((equity) => {
                return {
                    id: equity.equityId,
                    paymentMethod: equity.paymentMethod,
                    narration: equity.narration,
                    equityType: equity.equityType,
                    amount: equity.amount,
                    createdBy: equity.createdBy,
                };
            });

            return equities;
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
        .put(`/ops/equity/${editedEquity.equityId}`, editedEquity, {
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

function deleteEquity(equityId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/equity/${equityId}`, { signal: controller.signal })
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
