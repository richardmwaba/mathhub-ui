import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import LiabilitiesGrid from './LiabilitiesGrid';

const LiabilitiesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <LiabilitiesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default LiabilitiesPage;
