import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import AssetTypesGrid from './CashbookSummaryGrid';

const AssetTypesPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <AssetTypesGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AssetTypesPage;
