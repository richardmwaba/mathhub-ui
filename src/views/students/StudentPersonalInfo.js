import React, { useEffect, useRef, useState } from 'react';
import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
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
import DateUtils from 'src/utils/dateUtils';
import { isEmpty } from 'lodash';
import { EditButton } from 'src/components/common/EditButton';
import EditStudentBasicInfo from './EditStudentBasicInfo';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditContactDetails from './EditStudentContactDetails';
import { formatAddress, getFormattedAddresses, getFullname, getMobileNumber } from 'src/components/common/serviceutils';

const StudentPersonalInfo = ({ student, setStudent }) => {
    const [isVisibleEditParentsModal, setIsVisibleEditParentsModal] = useState(false);
    const [isVisibleEditContactDetailsModal, setIsVisibleEditContactDetailsModal] = useState(false);
    const [isVisibleEditBasicInfoModal, setIsVisibleEditBasicInfoModal] = useState(false);
    const [savedStudent, setSavedStudent] = useState({});
    const [toast, setToast] = useState(0);

    const studentActionSuccessToasterRef = useRef();

    const setUpdatedStudent = (updatedStudent) => {
        setStudent(updatedStudent);
        setSavedStudent(updatedStudent);
    };

    useEffect(() => {
        const studentSuccessfullyEditedToast = (
            <SuccessToast message={`Student's basic info has been updated successfully`} />
        );

        if (savedStudent?.firstName) {
            setToast(studentSuccessfullyEditedToast);
        }
    }, [savedStudent]);

    return (
        <CRow>
            <CContainer className="mt-3 md-3">
                <CRow>
                    <CCol xs={12} md={9} xl={9}>
                        <p>
                            Personal information and options to manage it. You can see your name, grade, contact details
                            and any other information uniquely related to you.
                        </p>
                    </CCol>
                </CRow>
                <CRow className="mt-3">
                    <CCol xs={12} md={9} xl={9}>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">
                                    Basic Info{' |'}
                                    <span>
                                        <EditButton
                                            buttonText="Update"
                                            item={student}
                                            isInGrid={false}
                                            setSelectedItem={setStudent}
                                            isVisibleEditModal={isVisibleEditBasicInfoModal}
                                            setIsVisibleEditModal={setIsVisibleEditBasicInfoModal}
                                        />
                                    </span>
                                </CCardTitle>
                                <CRow>
                                    <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                                        Name:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="name"
                                            defaultValue={student.name}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="birthday" className="col-sm-2 col-form-label">
                                        Birthday:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="birthday"
                                            defaultValue={`${DateUtils.formatDate(student.dateOfBirth, 'DD MMM YYYY')}`}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="gender" className="col-sm-2 col-form-label">
                                        Gender:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="gender"
                                            defaultValue={student.gender}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="grade" className="col-sm-2 col-form-label">
                                        Grade:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="grade"
                                            defaultValue={student.gradeName}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="examBoard" className="col-sm-2 col-form-label">
                                        Exam Board:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="examBoard"
                                            defaultValue={student.syllabus}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">
                                    Contact Details{' |'}
                                    <span>
                                        <EditButton
                                            buttonText="Update"
                                            item={student}
                                            setSelectedItem={setStudent}
                                            isVisibleEditModal={isVisibleEditContactDetailsModal}
                                            setIsVisibleEditModal={setIsVisibleEditContactDetailsModal}
                                        />
                                    </span>
                                </CCardTitle>
                                <CRow>
                                    <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">
                                        Email:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="name"
                                            defaultValue={student.email}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="phone" className="col-sm-2 col-form-label">
                                        Phone:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="birthday"
                                            defaultValue={student.fullPhoneNumber}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="address" className="col-sm-2 col-form-label">
                                        Address:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="gender"
                                            defaultValue={formatAddress(student.address)}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">
                                    Parents/Gurdians{' |'}
                                    <span>
                                        <EditButton
                                            buttonText="Update"
                                            item={student}
                                            setSelectedItem={setStudent}
                                            isVisibleEditModal={isVisibleEditParentsModal}
                                            setIsVisibleEditModal={setIsVisibleEditParentsModal}
                                        />
                                    </span>
                                </CCardTitle>
                                <CAccordion flush>
                                    {isEmpty(student.parents) ? (
                                        <p>Not parents registered for student.</p>
                                    ) : (
                                        student.parents.map((parent) => {
                                            return (
                                                <CAccordionItem key={parent.id} itemKey={parent.id}>
                                                    <CAccordionHeader>
                                                        <CFormLabel className="col-sm-12 fw-semibold">
                                                            {getFullname(
                                                                parent.firstName,
                                                                parent.middleName,
                                                                parent.lastName,
                                                            )}
                                                        </CFormLabel>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="phone"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Phone:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="phone"
                                                                    defaultValue={getMobileNumber(parent.phoneNumbers)}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="email"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Email:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="email"
                                                                    defaultValue={parent.email}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="Address"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Address:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="address"
                                                                    defaultValue={
                                                                        getFormattedAddresses(parent.addresses)[0]
                                                                    }
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
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
                {isVisibleEditBasicInfoModal && (
                    <EditStudentBasicInfo
                        student={student}
                        visibility={isVisibleEditBasicInfoModal}
                        setEditStudentModalVisibility={setIsVisibleEditBasicInfoModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                {isVisibleEditContactDetailsModal && (
                    <EditContactDetails
                        student={student}
                        visibility={isVisibleEditContactDetailsModal}
                        setEditStudentModalVisibility={setIsVisibleEditContactDetailsModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                <CToaster ref={studentActionSuccessToasterRef} push={toast} placement="bottom-end" />
            </CContainer>
        </CRow>
    );
};

StudentPersonalInfo.propTypes = {
    student: PropTypes.object.isRequired,
    setStudent: PropTypes.func.isRequired,
};

export default StudentPersonalInfo;
