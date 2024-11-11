import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import PaymentMethodsGrid from './PaymentMethodsGrid';

const PaymentMethodsPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <PaymentMethodsGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default PaymentMethodsPage;
