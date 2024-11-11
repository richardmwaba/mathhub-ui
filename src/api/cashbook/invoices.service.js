function getAllInvoices(params, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/invoices', { params }, { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.invoiceList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createInvoice(newInvoice, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/invoices', newInvoice, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editInvoice(editedInvoice, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/invoices/${editedInvoice.id}`, editedInvoice, {
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

function deleteInvoice(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/invoices/${id}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const InvoicesService = { createInvoice, deleteInvoice, editInvoice, getAllInvoices };

export default InvoicesService;
