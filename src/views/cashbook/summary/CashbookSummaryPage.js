import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import AssetTypesGrid from './CashbookSummaryGrid';

const AssetTypesPage = () => {
    return (
        <CContainer fluid>
            <CRow>
                <CCol xs={{ cols: 12 }}>
                    <CCard className="mb-4">
                        <CCardBody>
                            <AssetTypesGrid />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default AssetTypesPage;
