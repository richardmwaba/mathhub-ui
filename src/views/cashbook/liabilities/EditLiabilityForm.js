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
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import LiabilityTypesService from 'src/api/system-config/cashbook/liability-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditLiabilityForm({
    liability,
    visibility,
    setEditLiabilityModalVisibility,
    savedLiabilityCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const liabilityNameRef = useRef();
    const errorRef = useRef();
    const defaultLiability = {
        id: liability.id,
        narration: liability.narration,
        liabilityTypeId: liability.liabilityType.liabilityTypeId,
        paymentMethodId: liability.paymentMethod.paymentMethodId,
        amount: `${liability.amount}`,
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allLiabilityTypes, setAllLiabilityTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isEditLiabilityFormValidated, setIsEditLiabilityFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedLiability, setEditedLiability] = useState(defaultLiability);

    useEffect(() => {
        liabilityNameRef.current.focus();
    }, [liabilityNameRef]);

    const getLiabilityTypes = async () => {
        const liabilityTypes = await LiabilityTypesService.getAllLiabilityTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allLiabilityTypes = liabilityTypes.map((liabilityType) => {
            return { value: liabilityType.id, label: liabilityType.name };
        });
        isMounted && setAllLiabilityTypes(allLiabilityTypes);
    };

    const liabilityTypesWithPlaceholder = (liabilityTypes) => {
        return [{ value: '', label: 'Select liability type...' }, ...liabilityTypes];
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

    const handleEditLiability = async (event) => {
        const editLiabilityForm = event.currentTarget;

        if (editLiabilityForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LiabilitiesService.editLiability(editedLiability, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedLiability(defaultLiability);
                    setEditLiabilityModalVisibility(!visibility);
                    savedLiabilityCallBack(response);
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
        setIsEditLiabilityFormValidated(true);
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
            onClose={() => setEditLiabilityModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Liability</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the liability type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditLiabilityFormValidated}
                                        onSubmit={handleEditLiability}
                                        id="editLiabilityForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={liabilityNameRef}
                                            value={editedLiability.narration}
                                            onChange={(e) => {
                                                setEditedLiability((prev) => {
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
                                            options={liabilityTypesWithPlaceholder(allLiabilityTypes)}
                                            id="liabilityType"
                                            label="Type"
                                            required
                                            value={editedLiability.liabilityTypeId}
                                            onChange={(e) => {
                                                setEditedLiability((prev) => {
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
                                                value={editedLiability.amount}
                                                onChange={(e) => {
                                                    setEditedLiability((prev) => {
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
                                            options={paymentMethodsWithPlaceholder(allPaymentMethods)}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={editedLiability.paymentMethodId}
                                            onChange={(e) => {
                                                setEditedLiability((prev) => {
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
                <CButton color="secondary" onClick={() => setEditLiabilityModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editLiabilityForm" loading={isLoading} type="submit">
                    Save Liability
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditLiabilityForm.propTypes = {
    liability: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditLiabilityModalVisibility: PropTypes.func.isRequired,
    savedLiabilityCallBack: PropTypes.func.isRequired,
};
