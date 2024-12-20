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
import StudentsEnrolmentInfo from './StudentsEnrolmentInfo';
import StudentsFinances from './StudentsFinances';
import StudentsPersonalInfo from './StudentsPersonalInfo';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import StudentsService from 'src/api/sis/students.service';
import { PageLoading } from 'src/components/common/PageLoading';
import PropTypes from 'prop-types';

const StudentsDetails = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const [error, setError] = useState();
    const [student, setStudent] = useState();
    const [studentsEnrolledClasses, setStudentsEnrolledClasses] = useState([]);

    const getStudentId = () => {
        const locationFragments = location.pathname.split('/');
        return locationFragments.length > 4 ? locationFragments[3] : locationFragments.lastItem;
    };
    const studentId = getStudentId();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudent = async () => {
            const response = await StudentsService.getStudentById(studentId, axiosPrivate, controller, setError);
            isMounted && setStudent(response);
        };

        getStudent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, location, studentId]);

    useEffect(() => {
        const controller = new AbortController();
        const getStudentsEnrolledClasses = async () => {
            const response = await StudentsService.getAllClassesForStudent(
                studentId,
                axiosPrivate,
                controller,
                setError,
            );
            setStudentsEnrolledClasses(response);
        };

        getStudentsEnrolledClasses();

        return () => {
            controller.abort();
        };
    }, [axiosPrivate, student, studentId]);

    return (
        <>
            {error && (
                <CCard>
                    <CCardBody>
                        <CCol xs={12} md={9} xl={9}>
                            <p>
                                An error occurred while trying to fetch student details. Please try again later. If
                                error persists, contact the system administrator.
                            </p>
                        </CCol>
                    </CCardBody>
                </CCard>
            )}

            {student ? (
                <CRow>
                    <CCol xs={{ cols: 12 }}>
                        <StudentDetailsNavigation
                            student={student}
                            studentsEnrolledClasses={studentsEnrolledClasses}
                            setStudent={setStudent}
                        />
                    </CCol>
                </CRow>
            ) : (
                <PageLoading />
            )}
        </>
    );
};

const StudentDetailsNavigation = ({ student, studentsEnrolledClasses, setStudent }) => {
    const [activeTab, setActiveTab] = useState('enrolment-info');

    return (
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
                        key={`enrolment-info-${student.id}`}
                    >
                        <StudentsEnrolmentInfo student={student} studentsEnrolledClasses={studentsEnrolledClasses} />
                    </CTabPane>
                    <CTabPane
                        role="tabpanel"
                        aria-labelledby="finances-tab"
                        visible={activeTab === 'finances'}
                        key={`finances-${student.id}`}
                    >
                        <StudentsFinances student={student} />
                    </CTabPane>
                    <CTabPane
                        role="tabpanel"
                        aria-labelledby="personal-info-tab"
                        visible={activeTab === 'personal-info'}
                        key={`personal-info-${student.id}`}
                    >
                        <StudentsPersonalInfo student={student} setStudent={setStudent} />
                    </CTabPane>
                </CTabContent>
            </CCardBody>
        </CCard>
    );
};

StudentDetailsNavigation.propTypes = {
    student: PropTypes.object.isRequired,
    studentsEnrolledClasses: PropTypes.array.isRequired,
    setStudent: PropTypes.func.isRequired,
};

export default StudentsDetails;
