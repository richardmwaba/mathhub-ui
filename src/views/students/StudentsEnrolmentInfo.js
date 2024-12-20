import React, { useEffect, useRef, useState } from 'react';
import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CButton,
    CCard,
    CCardBody,
    CCardTitle,
    CCol,
    CContainer,
    CFormInput,
    CFormLabel,
    CRow,
    CToaster,
} from '@coreui/react-pro';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import DateUtils from 'src/utils/dateUtils';
import { DefaultAddButton } from 'src/components/common/AddButton';
import EnrollStudentInClass from './EnrollStudentInClass';
import StudentsService from 'src/api/sis/students.service';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { SuccessToast } from 'src/components/common/SuccessToast';

const StudentsEnrolmentInfo = ({ student, studentsEnrolledClasses }) => {
    const axiosPrivate = useAxiosPrivate();
    const [error, setError] = useState();
    const [isVisibleEnrollInClassModal, setIsVisibleEnrollInClassModal] = React.useState(false);
    const [studentsClasses, setStudentsClasses] = React.useState(studentsEnrolledClasses);
    const [isEnrolmentCompleted, setIsEnrolmentCompleted] = React.useState(false);
    const [toast, setToast] = useState(0);

    const enrolmentSuccessToasterRef = useRef();
    const completedEnrolmentCallBack = (enrolledClasses) => {
        setIsEnrolmentCompleted(true);
        setIsEnrolmentCompleted(enrolledClasses);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getClasses = async () => {
            const response = await StudentsService.getAllClassesForStudent(
                student.id,
                axiosPrivate,
                controller,
                setError,
            );
            isMounted && setStudentsClasses(response);
        };

        getClasses();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, student.id]);

    useEffect(() => {
        const studentSuccessfullyEditedToast = (
            <SuccessToast message={`Student has been successfuly enrolled in classes`} />
        );

        if (isEnrolmentCompleted) {
            setToast(studentSuccessfullyEditedToast);
        }
    }, [isEnrolmentCompleted]);

    return (
        <CRow>
            <CContainer className="mt-3 md-3">
                <CRow>
                    <CCol xs={12} md={9} xl={9}>
                        <p>
                            Enrolment information and options to manage it. You can see a summary of all the classes you
                            are enrolled in, add classes or remove existing ones.
                        </p>
                    </CCol>
                </CRow>
                <CRow className="mt-3">
                    <CCol xs={12} md={9} xl={9}>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">
                                    Enrolled Classes {' |'}
                                    <span>
                                        <DefaultAddButton
                                            buttonText="Enroll in a Class"
                                            isVisibleAddModal={isVisibleEnrollInClassModal}
                                            setIsVisibleAddModal={setIsVisibleEnrollInClassModal}
                                        />
                                    </span>
                                </CCardTitle>
                                <CAccordion flush>
                                    {error && (
                                        <p>
                                            An error occured while fetching the student&apos;s classes. Please try again
                                            or contact the system administrator if this persists.
                                        </p>
                                    )}
                                    {isEmpty(studentsClasses) ? (
                                        <p>Not enrolled in any classes currently.</p>
                                    ) : (
                                        studentsClasses.map((enrolledClass) => {
                                            return (
                                                <CAccordionItem key={enrolledClass.id}>
                                                    <CAccordionHeader>
                                                        <CCol className="col-sm-2 fw-semibold">
                                                            {enrolledClass.subject.name}
                                                        </CCol>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'occurence-' + enrolledClass.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Occurence:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'occurence-' + enrolledClass.id}
                                                                    value={`${enrolledClass.occurrence} total lessons`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'duration-' + enrolledClass.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Duration:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'duration-' + enrolledClass.id}
                                                                    value={`${enrolledClass.duration} ${enrolledClass.period}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'startDate-' + enrolledClass.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Start Date:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'startDate-' + enrolledClass.id}
                                                                    value={`${DateUtils.formatDate(enrolledClass.startDate, 'DD MMM YYYY')}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'cost-' + enrolledClass.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Cost:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'cost-' + enrolledClass.id}
                                                                    value={`K${enrolledClass.cost * enrolledClass.duration}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        {enrolledClass.paymentStatus === 'UNPAID' && (
                                                            <CButton
                                                                className="mt-3"
                                                                color="danger"
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Cancel Class
                                                            </CButton>
                                                        )}
                                                    </CAccordionBody>
                                                </CAccordionItem>
                                            );
                                        })
                                    )}
                                </CAccordion>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                {isVisibleEnrollInClassModal && (
                    <EnrollStudentInClass
                        student={student}
                        visibility={isVisibleEnrollInClassModal}
                        setIsVisibleEnrollInClassModal={setIsVisibleEnrollInClassModal}
                        completedEnrolmentCallBack={completedEnrolmentCallBack}
                    />
                )}
                <CToaster ref={enrolmentSuccessToasterRef} push={toast} placement="bottom-end" />
            </CContainer>
        </CRow>
    );
};

StudentsEnrolmentInfo.propTypes = {
    student: PropTypes.object.isRequired,
    studentsEnrolledClasses: PropTypes.array.isRequired,
};

export default StudentsEnrolmentInfo;
