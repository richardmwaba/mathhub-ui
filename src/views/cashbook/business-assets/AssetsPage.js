import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import AssetsGrid from './AssetsGrid';

const AssetsPage = () => {
    return (
        <CContainer fluid>
            <CRow>
                <CCol xs={{ cols: 12 }}>
                    <CCard className="mb-4">
                        <CCardBody>
                            <AssetsGrid />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default AssetsPage;
