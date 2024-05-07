function getAllPaymentMethods(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/paymentMethods', { signal: controller.signal })
        .then((response) => {
            let paymentMethods = [];

            const paymentMethodsList = response.data._embedded.paymentMethodList;

            paymentMethods = paymentMethodsList.map((paymentMethod) => {
                return {
                    id: paymentMethod.paymentMethodId,
                    name: paymentMethod.typeName,
                    description: paymentMethod.typeDescription,
                };
            });

            return paymentMethods;
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
            `/systemconfig/ops/paymentMethods/${editedPaymentMethod.paymentMethodId}`,
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
