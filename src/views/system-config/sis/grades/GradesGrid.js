/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import GradesService from 'src/api/sis/grades.service';
import CIcon from '@coreui/icons-react';
import NewGradeForm from './NewGradeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditGradeForm from './EditGradeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function GradesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [grades, setGrades] = useState([]);
    const [createdGrade, setCreatedGrade] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditGradeModal, setIsVisibleEditGradeModal] = useState(false);
    const [isVisibleNewGradeModal, setIsVisibleNewGradeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedGrade, setSavedGrade] = useState({});
    const [selectedGrade, setSelectedGrade] = useState({});
    const [toast, setToast] = useState(0);

    const gradeActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'name', label: 'Name', _style: { width: '40%' } },
        {
            key: 'description',
            label: 'Description',
            _style: { width: '60%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getGrades = async () => {
        const response = await GradesService.getAllGrades(axiosPrivate, controller, setError);
        isMounted && setGrades(response);
        setLoading(false);
    };

    const setCreatedGradeAndRefreshGrades = (newGrade) => {
        setCreatedGrade(newGrade);
        getGrades();
    };

    const setSavedGradeAndRefreshGrades = (savedEditedGrade) => {
        setSavedGrade(savedEditedGrade);
        getGrades();
    };

    // get grades data from api
    useEffect(() => {
        getGrades();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const gradeSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Grade ${createdGrade?.name} has been created successfully`}
            />
        );

        if (createdGrade?.name) {
            setToast(gradeSuccessfullyCreatedToast);
        }
    }, [createdGrade]);

    useEffect(() => {
        const gradeSuccessfullyEditedToast = (
            <SuccessToast
                message={`Grade ${savedGrade?.name} has been updated successfully`}
            />
        );

        if (savedGrade?.name) {
            setToast(gradeSuccessfullyEditedToast);
        }
    }, [savedGrade]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewGradeModal(!isVisibleNewGradeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Grade Type" /> Add New Grade
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'name', state: 'asc' }}
                    items={grades}
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
                            ? `Could not retrieve grades due to ${error}. Please try again.`
                            : 'No grades found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedGrade}
                                isVisibleEditModal={isVisibleEditGradeModal}
                                setIsVisibleEditModal={setIsVisibleEditGradeModal}
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
            {isVisibleNewGradeModal && (
                <NewGradeForm
                    visibility={isVisibleNewGradeModal}
                    setGradeModalVisibility={setIsVisibleNewGradeModal}
                    createdGradeCallBack={setCreatedGradeAndRefreshGrades}
                />
            )}
            {isVisibleEditGradeModal && (
                <EditGradeForm
                    grade={selectedGrade}
                    visibility={isVisibleEditGradeModal}
                    setEditGradeModalVisibility={setIsVisibleEditGradeModal}
                    savedGradeCallBack={setSavedGradeAndRefreshGrades}
                />
            )}
            <CToaster ref={gradeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
