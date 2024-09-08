import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
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
import StudentPersonalInfo from './StudentPersonalInfo';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import StudentsService from 'src/api/sis/students.service';

const StudentDetails = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [student, setStudent] = useState(location.state);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudentId = () => {
            const locationFragments = location.pathname.split('/');
            return locationFragments.length > 4 ? locationFragments[3] : locationFragments.lastItem;
        };

        const getStudent = async () => {
            const response = await StudentsService.getStudentById(getStudentId(), axiosPrivate, controller, setError);
            isMounted && setStudent(response);
        };

        getStudent();
        setLoading(false);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, location]);

    const [activeTab, setActiveTab] = useState('enrolment-info');
    return (
        student && (
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
        )
    );
};

export default StudentDetails;
