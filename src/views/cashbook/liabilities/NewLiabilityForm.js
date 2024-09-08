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
import LiabilitiesService from 'src/api/cashbook/liabilities.service';
import LiabilityTypesService from 'src/api/system-config/cashbook/liability-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewLiabilityForm({ visibility, setLiabilityModalVisibility, createdLiabilityCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const liabilityNameRef = useRef();
    const errorRef = useRef();
    const defaultLiability = {
        narration: '',
        liabilityTypeId: '',
        paymentMethodId: '',
        amount: '',
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allLiabilityTypes, setAllLiabilityTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isCreateLiabilityFormValidated, setIsCreateLiabilityFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newLiability, setNewLiability] = useState(defaultLiability);

    useEffect(() => {
        liabilityNameRef.current.focus();
    }, []);

    const getLiabilityTypes = async () => {
        const liabilityTypes = await LiabilityTypesService.getAllLiabilityTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allLiabilityTypes = liabilityTypes.map((liabilityType) => {
            return { value: liabilityType.id, label: liabilityType.name };
        });
        const liabilityTypesWithPlaceholder = [{ value: '', label: 'Select liability type...' }, ...allLiabilityTypes];
        isMounted && setAllLiabilityTypes(liabilityTypesWithPlaceholder);
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
        const paymentMethodsWithPlaceholder = [{ value: '', label: 'Select payment method...' }, ...allPaymentMethods];
        isMounted && setAllPaymentMethods(paymentMethodsWithPlaceholder);
    };

    const handleCreateNewLiability = async (event) => {
        const newLiabilityForm = event.currentTarget;

        if (newLiabilityForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LiabilitiesService.createLiability(newLiability, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewLiability(defaultLiability);
                    setLiabilityModalVisibility(!visibility);
                    createdLiabilityCallBack(response);
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
        setIsCreateLiabilityFormValidated(true);
    };

    useEffect(() => {
        getLiabilityTypes();

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
            onClose={() => setLiabilityModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Liability</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new liability. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateLiabilityFormValidated}
                                        onSubmit={handleCreateNewLiability}
                                        id="createNewLiabilityForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={liabilityNameRef}
                                            value={newLiability.narration}
                                            onChange={(e) => {
                                                setNewLiability((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select liability type..."
                                            autoComplete="off"
                                            options={allLiabilityTypes}
                                            id="liabilityType"
                                            label="Type"
                                            required
                                            value={newLiability.liabilityTypeId}
                                            onChange={(e) => {
                                                setNewLiability((prev) => {
                                                    return {
                                                        ...prev,
                                                        liabilityTypeId: e.target.value,
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
                                                value={newLiability.amount}
                                                onChange={(e) => {
                                                    setNewLiability((prev) => {
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
                                            options={allPaymentMethods}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={newLiability.paymentMethodId}
                                            onChange={(e) => {
                                                setNewLiability((prev) => {
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
                <CButton color="secondary" onClick={() => setLiabilityModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewLiabilityForm" loading={isLoading} type="submit">
                    Save Liability
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewLiabilityForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setLiabilityModalVisibility: PropTypes.func.isRequired,
    createdLiabilityCallBack: PropTypes.func.isRequired,
};
