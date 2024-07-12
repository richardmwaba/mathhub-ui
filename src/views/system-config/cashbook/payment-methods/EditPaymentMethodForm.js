import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CLoadingButton,
    CFormText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditPaymentMethodForm({
    paymentMethod,
    visibility,
    setEditPaymentMethodModalVisibility,
    savedPaymentMethodCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const paymentMethodNameRef = useRef();
    const errorRef = useRef();
    const defaultPaymentMethod = {
        id: paymentMethod.id,
        name: paymentMethod.name,
        description: paymentMethod.description,
    };

    const [isEditPaymentMethodFormValidated, setIsEditPaymentMethodFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedPaymentMethod, setEditedPaymentMethod] = useState(defaultPaymentMethod);

    useEffect(() => {
        paymentMethodNameRef.current.focus();
    }, [paymentMethodNameRef]);

    const handleEditPaymentMethod = async (event) => {
        const editPaymentMethodForm = event.currentTarget;

        if (editPaymentMethodForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await PaymentMethodsService.editPaymentMethod(
                editedPaymentMethod,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedPaymentMethod(defaultPaymentMethod);
                    setEditPaymentMethodModalVisibility(!visibility);
                    savedPaymentMethodCallBack(response);
                },
                (error) => {
                    if (!error?.response) {
                        setErrorMessage('No server response');
                    }

                    setErrorMessage(error.message);
                    errorRef.current?.focus();
                },
            );
        }

        setIsLoading(false);
        setIsEditPaymentMethodFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditPaymentMethodModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Payment Method</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the payment method. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditPaymentMethodFormValidated}
                                        onSubmit={handleEditPaymentMethod}
                                        id="editPaymentMethodForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Payment Method Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={paymentMethodNameRef}
                                            value={editedPaymentMethod.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedPaymentMethod((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Payment Method Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedPaymentMethod.description}
                                            onChange={(e) => {
                                                setEditedPaymentMethod((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color="secondary"
                    onClick={() => setEditPaymentMethodModalVisibility(false)}
                >
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editPaymentMethodForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Payment Method
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditPaymentMethodForm.propTypes = {
    paymentMethod: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditPaymentMethodModalVisibility: PropTypes.func.isRequired,
    savedPaymentMethodCallBack: PropTypes.func.isRequired,
};
