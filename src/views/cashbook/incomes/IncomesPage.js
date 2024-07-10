import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import IncomesGrid from './IncomesGrid';

const IncomesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <IncomesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default IncomesPage;
