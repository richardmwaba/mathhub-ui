function getAllPaymentMethods(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/ops/paymentMethods', { signal: controller.signal })
        .then((response) => {
            let paymentMethods = [];

            const paymentMethodsList = response.data._embedded.paymentMethodDtoList;

            paymentMethods = paymentMethodsList.map((paymentMethod) => {
                return {
                    id: paymentMethod.paymentMethodId,
                    type: paymentMethod.typeName,
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

const PaymentMethodsService = { getAllPaymentMethods };

export default PaymentMethodsService;
