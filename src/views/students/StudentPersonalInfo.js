import React from 'react';
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
} from '@coreui/react-pro';
import PropTypes from 'prop-types';
import DateUtils from 'src/utils/dateUtils';
import { isEmpty } from 'lodash';
import StudentsService from 'src/api/sis/students.service';

const StudentPersonalInfo = ({ student }) => {
    const addresses = StudentsService.getFormattedAddresses(student.addresses);

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
                                <CCardTitle className="fs-5">Basic Info</CCardTitle>
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
                                <CCardTitle className="fs-5">Contact Details</CCardTitle>
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
                                            defaultValue={student.mobileNumber}
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
                                            defaultValue={addresses[0]}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">Parents/Gurdians</CCardTitle>
                                <CAccordion flush>
                                    {isEmpty(student.parents) ? (
                                        <p>Not parents registered for student.</p>
                                    ) : (
                                        student.parents.map((parent) => {
                                            return (
                                                <CAccordionItem key={parent.id} itemKey={parent.id}>
                                                    <CAccordionHeader>
                                                        <CFormLabel className="col-sm-12 fw-semibold">
                                                            {StudentsService.getFullname(
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
                                                                    defaultValue={StudentsService.getMobileNumber(
                                                                        parent.phoneNumbers,
                                                                    )}
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
                                                                        StudentsService.getFormattedAddresses(
                                                                            parent.addresses,
                                                                        )[0]
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
            </CContainer>
        </CRow>
    );
};

StudentPersonalInfo.propTypes = {
    student: PropTypes.object.isRequired,
};

export default StudentPersonalInfo;
