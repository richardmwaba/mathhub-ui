import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro';
import ExamBoardsGrid from './ExamBoardsGrid';

const ExamBoardsPage = () => {
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardBody>
                        <ExamBoardsGrid />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ExamBoardsPage;
