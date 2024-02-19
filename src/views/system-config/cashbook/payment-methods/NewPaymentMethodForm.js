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

export default function NewPaymentMethodForm({
    visibility,
    setPaymentMethodModalVisibility,
    createdPaymentMethodCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const typeNameRef = useRef();
    const errorRef = useRef();
    const defaultPaymentMethod = {
        typeName: '',
        typeDescription: '',
    };

    const [isCreatePaymentMethodFormValidated, setIsCreatePaymentMethodFormValidated] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newPaymentMethod, setNewPaymentMethod] = useState(defaultPaymentMethod);

    useEffect(() => {
        typeNameRef.current.focus();
    }, []);

    const handleCreateNewPaymentMethod = async (event) => {
        const newPaymentMethodForm = event.currentTarget;

        if (newPaymentMethodForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await PaymentMethodsService.createPaymentMethod(
                newPaymentMethod,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewPaymentMethod(defaultPaymentMethod);
                    setPaymentMethodModalVisibility(!visibility);
                    createdPaymentMethodCallBack(response);
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
        setIsCreatePaymentMethodFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setPaymentMethodModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Asset Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new asset type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreatePaymentMethodFormValidated}
                                        onSubmit={handleCreateNewPaymentMethod}
                                        id="createNewPaymentMethodForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={typeNameRef}
                                            value={newPaymentMethod.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewPaymentMethod((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Description"
                                            autoComplete="tyepDescription"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newPaymentMethod.typeDescription}
                                            onChange={(e) => {
                                                setNewPaymentMethod((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeDescription: e.target.value,
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
                <CButton color="secondary" onClick={() => setPaymentMethodModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewPaymentMethodForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Asset Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewPaymentMethodForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setPaymentMethodModalVisibility: PropTypes.func.isRequired,
    createdPaymentMethodCallBack: PropTypes.func.isRequired,
};
