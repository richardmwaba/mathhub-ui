import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import IncomeTypesGrid from './IncomeTypesGrid';

const IncomeTypesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <IncomeTypesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default IncomeTypesPage;
