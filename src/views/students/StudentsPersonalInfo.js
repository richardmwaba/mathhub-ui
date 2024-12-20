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
import DateUtils from 'src/utils/dateUtils';
import { isEmpty } from 'lodash';
import { DefaultEditButton } from 'src/components/common/EditButton';
import EditStudentsBasicInfo from './EditStudentsBasicInfo';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditStudentsContactDetails from './EditStudentsContactDetails';
import { formatAddress, getFullname, getFullPhoneNumber } from 'src/components/common/serviceutils';
import EditStudentParent from './EditStudentsParent';
import { DefaultAddButton } from 'src/components/common/AddButton';
import AddStudentsParent from './AddStudentsParent';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import DeleteStudentsParent from './DeleteStudentsParent';

const StudentsPersonalInfo = ({ student, setStudent }) => {
    const [isVisibleEditParentModal, setIsVisibleEditParentModal] = useState(false);
    const [isVisibleAddParentModal, setIsVisibleAddParentModal] = useState(false);
    const [isVisibleDeleteParentModal, setIsVisibleDeleteParentModal] = useState(false);
    const [isVisibleEditContactDetailsModal, setIsVisibleEditContactDetailsModal] = useState(false);
    const [isVisibleEditBasicInfoModal, setIsVisibleEditBasicInfoModal] = useState(false);
    const [savedStudent, setSavedStudent] = useState(student);
    const [selectedParent, setSelectedParent] = useState({});
    const [toast, setToast] = useState(0);

    const studentActionSuccessToasterRef = useRef();
    const previousStudent = useRef();

    const setUpdatedStudent = (updatedStudent) => {
        previousStudent.current = savedStudent;
        setStudent({ ...updatedStudent });
        setSavedStudent({ ...updatedStudent });
    };

    useEffect(() => {
        const studentSuccessfullyEditedToast = (
            <SuccessToast message={`Student's basic info has been updated successfully`} />
        );

        if (previousStudent.current && savedStudent !== previousStudent.current) {
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
                                        <DefaultEditButton
                                            buttonText="Update"
                                            item={savedStudent}
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
                                            autoComplete="off"
                                            type="text"
                                            id="name"
                                            value={savedStudent.name}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsBirthday" className="col-sm-2 col-form-label">
                                        Birthday:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsBirthday"
                                            value={`${DateUtils.formatDate(savedStudent.dateOfBirth, 'DD MMM YYYY')}`}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsGender" className="col-sm-2 col-form-label">
                                        Gender:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsGender"
                                            value={savedStudent.gender}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsGrade" className="col-sm-2 col-form-label">
                                        Grade:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsGrade"
                                            value={savedStudent.gradeName}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsExamBoard" className="col-sm-2 col-form-label">
                                        Exam Board:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsExamBoard"
                                            value={savedStudent.syllabus}
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
                                        <DefaultEditButton
                                            buttonText="Update"
                                            item={savedStudent}
                                            setSelectedItem={setStudent}
                                            isVisibleEditModal={isVisibleEditContactDetailsModal}
                                            setIsVisibleEditModal={setIsVisibleEditContactDetailsModal}
                                        />
                                    </span>
                                </CCardTitle>
                                <CRow>
                                    <CFormLabel htmlFor="studentsEmail" className="col-sm-2 col-form-label">
                                        Email:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsEmail"
                                            value={savedStudent.email}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsPhone" className="col-sm-2 col-form-label">
                                        Phone:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsPhone"
                                            value={savedStudent.fullPhoneNumber}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="studentsAddress" className="col-sm-2 col-form-label">
                                        Address:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="studentsAddress"
                                            value={formatAddress(savedStudent.address)}
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
                                    Parents/Gurdians
                                    {student.parents.length < 2 && (
                                        <>
                                            {' |'}
                                            <span>
                                                <DefaultAddButton
                                                    buttonText="Add Parent"
                                                    isVisibleAddModal={isVisibleAddParentModal}
                                                    setIsVisibleAddModal={setIsVisibleAddParentModal}
                                                />
                                            </span>
                                        </>
                                    )}
                                </CCardTitle>
                                <CAccordion flush>
                                    {isEmpty(savedStudent.parents) ? (
                                        <p>No parents registered for student.</p>
                                    ) : (
                                        savedStudent.parents.map((parent) => {
                                            return (
                                                <CAccordionItem key={parent.id}>
                                                    <CAccordionHeader>
                                                        <CCol className="col-sm-12 fw-semibold">
                                                            {getFullname(
                                                                parent.firstName,
                                                                parent.middleName,
                                                                parent.lastName,
                                                            )}
                                                        </CCol>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'parentsGender-' + parent.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Gender:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'parentsGender-' + parent.id}
                                                                    value={parent.gender}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'parentsPhone-' + parent.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Phone:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'parentsPhone-' + parent.id}
                                                                    value={getFullPhoneNumber(parent.phoneNumber)}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'parentsEmail-' + parent.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Email:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'parentsEmail-' + parent.id}
                                                                    value={parent.email}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor={'parentsAddress-' + parent.id}
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Address:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id={'parentsAddress-' + parent.id}
                                                                    value={
                                                                        formatAddress(parent.address) ?? 'No address'
                                                                    }
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <DefaultEditButton
                                                            className="mt-3"
                                                            buttonText="Update"
                                                            item={parent}
                                                            setSelectedItem={setSelectedParent}
                                                            isVisibleEditModal={isVisibleEditParentModal}
                                                            setIsVisibleEditModal={setIsVisibleEditParentModal}
                                                            variant="outline"
                                                        />
                                                        <CButton
                                                            className="mt-3 ms-4"
                                                            color="danger"
                                                            onClick={() => {
                                                                setSelectedParent(parent);
                                                                setIsVisibleDeleteParentModal(!isVisibleAddParentModal);
                                                            }}
                                                            variant="outline"
                                                            size="sm"
                                                            shape="rounded"
                                                        >
                                                            <CIcon
                                                                icon={cilTrash}
                                                                title={`Delete ${parent.firstName}`}
                                                                size="sm"
                                                            />{' '}
                                                            Delete
                                                        </CButton>
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
                    <EditStudentsBasicInfo
                        student={savedStudent}
                        visibility={isVisibleEditBasicInfoModal}
                        setEditStudentModalVisibility={setIsVisibleEditBasicInfoModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                {isVisibleEditContactDetailsModal && (
                    <EditStudentsContactDetails
                        student={savedStudent}
                        visibility={isVisibleEditContactDetailsModal}
                        setEditStudentModalVisibility={setIsVisibleEditContactDetailsModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                {isVisibleEditParentModal && (
                    <EditStudentParent
                        student={savedStudent}
                        parent={selectedParent}
                        visibility={isVisibleEditParentModal}
                        setEditParentModalVisibility={setIsVisibleEditParentModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                {isVisibleAddParentModal && (
                    <AddStudentsParent
                        student={savedStudent}
                        visibility={isVisibleAddParentModal}
                        setAddParentModalVisibility={setIsVisibleAddParentModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                {isVisibleDeleteParentModal && (
                    <DeleteStudentsParent
                        student={savedStudent}
                        parent={selectedParent}
                        visibility={isVisibleDeleteParentModal}
                        setDeleteParentModalVisibility={setIsVisibleDeleteParentModal}
                        savedStudentCallBack={setUpdatedStudent}
                    />
                )}
                <CToaster
                    key={`toast-${savedStudent.id}`}
                    ref={studentActionSuccessToasterRef}
                    push={toast}
                    placement="bottom-end"
                />
            </CContainer>
        </CRow>
    );
};

StudentsPersonalInfo.propTypes = {
    student: PropTypes.object.isRequired,
    setStudent: PropTypes.func.isRequired,
};

export default StudentsPersonalInfo;
