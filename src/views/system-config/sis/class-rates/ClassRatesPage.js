import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import ClassRatesGrid from './ClassRatesGrid';

const LessonRatesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <ClassRatesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default LessonRatesPage;
