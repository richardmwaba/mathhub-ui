import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import GradesGrid from './GradesGrid';

const GradesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <GradesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default GradesPage;
