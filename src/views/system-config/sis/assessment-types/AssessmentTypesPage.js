import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import AssessmentTypesGrid from './AssessmentTypesGrid';

const AssessmentTypesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <AssessmentTypesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AssessmentTypesPage;
