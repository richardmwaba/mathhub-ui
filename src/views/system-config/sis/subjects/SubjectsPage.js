import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import SessionTypesGrid from './SubjectsGrid';

const SessionTypesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <SessionTypesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default SessionTypesPage;
