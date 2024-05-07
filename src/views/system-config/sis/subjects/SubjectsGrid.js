/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import SubjectsService from 'src/api/sis/subjects.service';
import CIcon from '@coreui/icons-react';
import NewSubjectForm from './NewSubjectForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditSubjectForm from './EditSubjectForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function SubjectsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [subjectsFromResponse, setSubjectsFromResponse] = useState([]);
    const [subjectsToDisplay, setSubjectsToDisplay] = useState([]);
    const [createdSubject, setCreatedSubject] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditSubjectModal, setIsVisibleEditSubjectModal] = useState(false);
    const [isVisibleNewSubjectModal, setIsVisibleNewSubjectModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedSubject, setSavedSubject] = useState({});
    const [selectedSubject, setSelectedSubject] = useState({});
    const [toast, setToast] = useState(0);

    const subjectActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'name', label: 'Name', _style: { width: '40%' } },
        {
            key: 'grades',
            label: 'Grades Offered',
            _style: { width: '30%' },
        },
        {
            key: 'complexity',
            label: 'Complexity',
            _style: { width: '30%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getSubjects = async () => {
        const response = await SubjectsService.getAllSubjects(axiosPrivate, controller, setError);
        isMounted && setSubjectsFromResponse(response);
        setLoading(false);
    };

    const setCreatedSubjectAndRefreshSubjects = (newSubject) => {
        setCreatedSubject(newSubject);
        getSubjects();
    };

    const setSavedSubjectAndRefreshSubjects = (savedEditedSubject) => {
        setSavedSubject(savedEditedSubject);
        getSubjects();
    };

    // get subjects data from api
    useEffect(() => {
        getSubjects();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    // transform subjects data to display
    useEffect(() => {
        const subjectsToDisplay = subjectsFromResponse.map((subject) => {
            return {
                id: subject.id,
                name: subject.name,
                grades: subject.grades.map((grade) => grade.name).join(', '),
                complexity: subject.complexity,
            };
        });
        setSubjectsToDisplay(subjectsToDisplay);
    }, [subjectsFromResponse]);

    useEffect(() => {
        const subjectSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Subject ${createdSubject?.subjectName} has been created successfully`}
            />
        );

        if (createdSubject?.subjectName) {
            setToast(subjectSuccessfullyCreatedToast);
        }
    }, [createdSubject]);

    useEffect(() => {
        const subjectSuccessfullyEditedToast = (
            <SuccessToast
                message={`Subject ${savedSubject?.subjectName} has been updated successfully`}
            />
        );

        if (savedSubject?.subjectName) {
            setToast(subjectSuccessfullyEditedToast);
        }
    }, [savedSubject]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewSubjectModal(!isVisibleNewSubjectModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Subject Type" /> Add New Subject
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'name', state: 'asc' }}
                    items={subjectsToDisplay}
                    columns={columns}
                    itemsPerPage={10}
                    columnFilter
                    columnSorter
                    tableFilter
                    loading={loading}
                    cleaner
                    itemsPerPageSelect
                    pagination
                    noItemsLabel={
                        error
                            ? `Could not retrieve subjects due to ${error}. Please try again.`
                            : 'No subjects found'
                    }
                    scopedColumns={{
                        show_details: (currentSubject) => (
                            <EditButton
                                item={subjectsFromResponse.find(
                                    (subject) => subject.id === currentSubject.id,
                                )}
                                setSelectedItem={setSelectedSubject}
                                isVisibleEditModal={isVisibleEditSubjectModal}
                                setIsVisibleEditModal={setIsVisibleEditSubjectModal}
                            />
                        ),
                    }}
                    tableProps={{
                        hover: true,
                        responsive: true,
                        striped: true,
                    }}
                />
            </CCardBody>
            {isVisibleNewSubjectModal && (
                <NewSubjectForm
                    visibility={isVisibleNewSubjectModal}
                    setSubjectModalVisibility={setIsVisibleNewSubjectModal}
                    createdSubjectCallBack={setCreatedSubjectAndRefreshSubjects}
                />
            )}
            {isVisibleEditSubjectModal && (
                <EditSubjectForm
                    subject={selectedSubject}
                    visibility={isVisibleEditSubjectModal}
                    setEditSubjectModalVisibility={setIsVisibleEditSubjectModal}
                    savedSubjectCallBack={setSavedSubjectAndRefreshSubjects}
                />
            )}
            <CToaster ref={subjectActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
