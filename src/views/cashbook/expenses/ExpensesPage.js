import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import ExpensesGrid from './ExpensesGrid';

const ExpensesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <ExpensesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ExpensesPage;
