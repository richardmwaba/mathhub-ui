import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import ExpenseTypesGrid from './ExpenseTypesGrid';

const ExpenseTypesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <ExpenseTypesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ExpenseTypesPage;
