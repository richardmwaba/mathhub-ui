import React from 'react';
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react-pro';
import UsersGrid from './UsersGrid';

const UsersPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <UsersGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default UsersPage;
