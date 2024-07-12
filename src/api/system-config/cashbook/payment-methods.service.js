function getAllPaymentMethods(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/paymentMethods', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.paymentMethodList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createPaymentMethod(newPaymentMethod, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/ops/paymentMethods', newPaymentMethod, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editPaymentMethod(editedPaymentMethod, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(
            `/systemconfig/ops/paymentMethods/${editedPaymentMethod.id}`,
            editedPaymentMethod,
            {
                signal: controller.signal,
            },
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const PaymentMethodsService = { createPaymentMethod, editPaymentMethod, getAllPaymentMethods };

export default PaymentMethodsService;
