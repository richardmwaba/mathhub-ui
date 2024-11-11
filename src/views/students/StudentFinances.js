import React, { useEffect, useState } from 'react';
import {
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
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import InvoicesService from 'src/api/cashbook/invoices.service';
import { isEmpty } from 'lodash';

const StudentFinances = ({ student }) => {
    const axiosPrivate = useAxiosPrivate();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const studentFinancialSummary = student.financialSummary;

    // get students data from api
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const params = new URLSearchParams({ studentId: student.id, status: 'PENDING' });

        const getStudents = async () => {
            const response = await InvoicesService.getAllInvoices(params, axiosPrivate, controller, setError);
            isMounted && setInvoices(response);
        };

        getStudents();
        setLoading(false);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, student]);

    return (
        <CRow>
            <CContainer className="mt-3 md-3">
                <CRow>
                    <CCol xs={12} md={9} xl={9}>
                        <p>
                            Financial information and options to manage it. You can see a summary of the classes you
                            have paid for, are owing, as well as make payments.
                        </p>
                    </CCol>
                </CRow>
                <CRow className="mt-3">
                    <CCol xs={12} md={9} xl={9}>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CCardTitle className="fs-5">Owing</CCardTitle>
                                <CRow>
                                    <CFormLabel htmlFor="amount" className="col-sm-2 col-form-label">
                                        Amount:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="amount"
                                            defaultValue={`K${studentFinancialSummary.amountOwing}`}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="dueDate" className="col-sm-2 col-form-label">
                                        Due Date:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="dueDate"
                                            defaultValue={`${DateUtils.formatDate(studentFinancialSummary.dueDate, 'DD MMM YYYY')}`}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CFormLabel htmlFor="activeInvoice" className="col-sm-2 col-form-label">
                                        Active Invoice:
                                    </CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="text"
                                            id="dueDate"
                                            defaultValue={hasActiveInvoice ? 'Yes' : 'No'}
                                            readOnly
                                            plainText
                                        />
                                    </CCol>
                                </CRow>
                                {shouldGenerateInvoice(student, invoices) && (
                                    <CButton className="mt-3" color="primary" variant="outline" size="sm">
                                        Generate Invoice
                                    </CButton>
                                )}
                                <CButton className="mt-3" color="primary" variant="outline" size="sm">
                                    View/Pay Invoice
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </CRow>
    );
};

function shouldGenerateInvoice(student, invoices) {
    return student.financialSummary.isOwing && isEmpty(invoices);
}

function hasActiveInvoice(student, invoices) {
    return student.financialSummary.isOwing && !isEmpty(invoices);
}

StudentFinances.propTypes = {
    student: PropTypes.object.isRequired,
};

export default StudentFinances;
