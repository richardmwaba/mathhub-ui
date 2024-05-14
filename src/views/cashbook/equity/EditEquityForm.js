/* eslint-disable react-hooks/exhaustive-deps */
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
    CFormSelect,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import EquitiesService from 'src/api/cashbook/equities.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditEquityForm({
    equity,
    visibility,
    setEditEquityModalVisibility,
    savedEquityCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const equityNameRef = useRef();
    const errorRef = useRef();
    const defaultEquity = {
        equityId: equity.id,
        narration: equity.narration,
        equityTypeId: equity.equityType.equityTypeId,
        paymentMethodId: equity.paymentMethod.paymentMethodId,
        amount: `${equity.amount}`,
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allEquityTypes, setAllEquityTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isEditEquityFormValidated, setIsEditEquityFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedEquity, setEditedEquity] = useState(defaultEquity);

    useEffect(() => {
        equityNameRef.current.focus();
    }, [equityNameRef]);

    const getEquityTypes = async () => {
        const equityTypes = await EquityTypesService.getAllEquityTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allEquityTypes = equityTypes.map((equityType) => {
            return { value: equityType.id, label: equityType.name };
        });
        isMounted && setAllEquityTypes(allEquityTypes);
    };

    const equityTypesWithPlaceholder = (equityTypes) => {
        return [{ value: '', label: 'Select equity type...' }, ...equityTypes];
    };

    const paymentMethods = async () => {
        const paymentMethods = await PaymentMethodsService.getAllPaymentMethods(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allPaymentMethods = paymentMethods.map((paymentMethod) => {
            return { value: paymentMethod.id, label: paymentMethod.name };
        });
        isMounted && setAllPaymentMethods(allPaymentMethods);
    };

    const paymentMethodsWithPlaceholder = (paymentMethods) => {
        return [{ value: '', label: 'Select payment method...' }, ...paymentMethods];
    };

    const handleEditEquity = async (event) => {
        const editEquityForm = event.currentTarget;

        if (editEquityForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await EquitiesService.editEquity(
                editedEquity,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedEquity(defaultEquity);
                    setEditEquityModalVisibility(!visibility);
                    savedEquityCallBack(response);
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
        setIsEditEquityFormValidated(true);
    };

    useEffect(() => {
        getEquityTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        paymentMethods();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditEquityModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Equity</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the equity type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditEquityFormValidated}
                                        onSubmit={handleEditEquity}
                                        id="editEquityForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={equityNameRef}
                                            value={editedEquity.narration}
                                            onChange={(e) => {
                                                setEditedEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select equity type..."
                                            autoComplete="off"
                                            options={equityTypesWithPlaceholder(allEquityTypes)}
                                            id="equityType"
                                            label="Type"
                                            required
                                            value={editedEquity.equityTypeId}
                                            onChange={(e) => {
                                                setEditedEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        equityTypeId: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormLabel>Amount</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                placeholder="Amount"
                                                autoComplete="off"
                                                id="amount"
                                                required
                                                type="number"
                                                value={editedEquity.amount}
                                                onChange={(e) => {
                                                    setEditedEquity((prev) => {
                                                        return {
                                                            ...prev,
                                                            amount: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select payment method..."
                                            autoComplete="off"
                                            options={paymentMethodsWithPlaceholder(
                                                allPaymentMethods,
                                            )}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={editedEquity.paymentMethodId}
                                            onChange={(e) => {
                                                setEditedEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        paymentMethodId: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditEquityModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editEquityForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Equity
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditEquityForm.propTypes = {
    equity: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditEquityModalVisibility: PropTypes.func.isRequired,
    savedEquityCallBack: PropTypes.func.isRequired,
};
