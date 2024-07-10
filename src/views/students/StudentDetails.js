import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTabPane,
} from '@coreui/react-pro';
import { useLocation } from 'react-router-dom';
import StudentEnrolmentInfo from './StudentEnrolmentInfo';
import StudentFinances from './StudentFinances';
import StudentProgressReport from './StudentProgressReport';
import StudentPersonalInfo from './StudentPersonalInfo';

const StudentDetails = () => {
    const student = useLocation().state;

    const [activeTab, setActiveTab] = useState('enrolment-info');
    return (
        <CRow>
            <CCol xs={{ cols: 12 }}>
                <CCard className="mb-4">
                    <CCardHeader as="h5">{student.name}</CCardHeader>
                    <CCardBody>
                        <CNav variant="underline-border" role="tablist">
                            <CNavItem>
                                <CNavLink
                                    type="button"
                                    active={activeTab === 'enrolment-info'}
                                    onClick={() => setActiveTab('enrolment-info')}
                                >
                                    Enrolment Info
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    type="button"
                                    active={activeTab === 'finances'}
                                    onClick={() => setActiveTab('finances')}
                                >
                                    Finances
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    type="button"
                                    active={activeTab === 'progress-report'}
                                    onClick={() => setActiveTab('progress-report')}
                                >
                                    Progress Report
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    type="button"
                                    active={activeTab === 'personal-info'}
                                    onClick={() => setActiveTab('personal-info')}
                                >
                                    Personal Info
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane
                                role="tabpanel"
                                aria-labelledby="enrolment-info-tab"
                                visible={activeTab === 'enrolment-info'}
                            >
                                <StudentEnrolmentInfo student={student} />
                            </CTabPane>
                            <CTabPane
                                role="tabpanel"
                                aria-labelledby="finances-tab"
                                visible={activeTab === 'finances'}
                            >
                                <StudentFinances student={student} />
                            </CTabPane>
                            <CTabPane
                                role="tabpanel"
                                aria-labelledby="progress-report-tab"
                                visible={activeTab === 'progress-report'}
                            >
                                <StudentProgressReport student={student} />
                            </CTabPane>
                            <CTabPane
                                role="tabpanel"
                                aria-labelledby="personal-info-tab"
                                visible={activeTab === 'personal-info'}
                            >
                                <StudentPersonalInfo student={student} />
                            </CTabPane>
                        </CTabContent>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default StudentDetails;
