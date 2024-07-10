import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import EquitiesGrid from './EquitiesGrid';

const EquitiesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <EquitiesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default EquitiesPage;
