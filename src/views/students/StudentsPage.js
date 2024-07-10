import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import StudentsGrid from './StudentsGrid';

const StudentsPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <StudentsGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default StudentsPage;
