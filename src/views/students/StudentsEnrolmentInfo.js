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
import { isEmpty } from 'lodash';
import DateUtils from 'src/utils/dateUtils';

const StudentsEnrolmentInfo = ({ student }) => {
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
                                <CCardTitle className="fs-5">Enrolled Classes</CCardTitle>
                                <CAccordion flush>
                                    {isEmpty(student.classes) ? (
                                        <p>Not enrolled on any classes currently.</p>
                                    ) : (
                                        student.classes.map((aClass) => {
                                            return (
                                                <CAccordionItem key={aClass.id} itemKey={aClass.id}>
                                                    <CAccordionHeader>
                                                        <CFormLabel className="col-sm-2 fw-semibold">
                                                            {aClass.subject.name}
                                                        </CFormLabel>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="occurence"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Occurence:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="occurence"
                                                                    defaultValue={`${aClass.occurrence} total lessons`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="duration"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Duration:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="duration"
                                                                    defaultValue={`${aClass.duration} ${aClass.period}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="startDate"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Start Date:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="startDate"
                                                                    defaultValue={`${DateUtils.formatDate(aClass.startDate, 'DD MMM YYYY')}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CFormLabel
                                                                htmlFor="cost"
                                                                className="col-sm-2 col-form-label"
                                                            >
                                                                Cost:
                                                            </CFormLabel>
                                                            <CCol sm={10}>
                                                                <CFormInput
                                                                    type="text"
                                                                    id="cost"
                                                                    defaultValue={`K${aClass.cost * aClass.duration}`}
                                                                    readOnly
                                                                    plainText
                                                                />
                                                            </CCol>
                                                        </CRow>
                                                        {aClass.paymentStatus === 'UNPAID' && (
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
            </CContainer>
        </CRow>
    );
};

StudentsEnrolmentInfo.propTypes = {
    student: PropTypes.object.isRequired,
};

export default StudentsEnrolmentInfo;
