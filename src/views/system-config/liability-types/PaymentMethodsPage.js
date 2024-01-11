import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import PaymentMethodsGrid from './PaymentMethodsGrid';

const PaymentMethodsPage = () => {
    return (
        <CContainer fluid>
            <CRow>
                <CCol xs={{ cols: 12 }}>
                    <CCard className="mb-4">
                        <CCardBody>
                            <PaymentMethodsGrid />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default PaymentMethodsPage;
