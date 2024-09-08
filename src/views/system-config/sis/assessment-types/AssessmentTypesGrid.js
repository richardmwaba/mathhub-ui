/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import AssessmentTypesService from 'src/api/system-config/sis/assessment-types.service';
import CIcon from '@coreui/icons-react';
import NewAssessmentTypeForm from './NewAssessmentTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditAssessmentTypeForm from './EditAssessmentTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function AssessmentTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [assessmentTypes, setAssessmentTypes] = useState([]);
    const [createdAssessmentType, setCreatedAssessmentType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditAssessmentTypeModal, setIsVisibleEditAssessmentTypeModal] = useState(false);
    const [isVisibleNewAssessmentTypeModal, setIsVisibleNewAssessmentTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAssessmentType, setSavedAssessmentType] = useState({});
    const [selectedAssessmentType, setSelectedAssessmentType] = useState({});
    const [toast, setToast] = useState(0);

    const assessmentTypeActionSuccessToasterRef = useRef();

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

    const getAssessmentTypes = async () => {
        const response = await AssessmentTypesService.getAllAssessmentTypes(axiosPrivate, controller, setError);
        isMounted && setAssessmentTypes(response);
        setLoading(false);
    };

    const setCreatedAssessmentTypeAndRefreshAssessmentTypes = (newAssessmentType) => {
        setCreatedAssessmentType(newAssessmentType);
        getAssessmentTypes();
    };

    const setSavedAssessmentTypeAndRefreshAssessmentTypes = (savedEditedAssessmentType) => {
        setSavedAssessmentType(savedEditedAssessmentType);
        getAssessmentTypes();
    };

    // get assessment types data from api
    useEffect(() => {
        getAssessmentTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const assessmentTypeSuccessfullyCreatedToast = (
            <SuccessToast message={`Assessment type ${createdAssessmentType?.name} has been created successfully`} />
        );

        if (createdAssessmentType?.name) {
            setToast(assessmentTypeSuccessfullyCreatedToast);
        }
    }, [createdAssessmentType]);

    useEffect(() => {
        const assessmentTypeSuccessfullyEditedToast = (
            <SuccessToast message={`Assessment type ${savedAssessmentType?.name} has been updated successfully`} />
        );

        if (savedAssessmentType?.name) {
            setToast(assessmentTypeSuccessfullyEditedToast);
        }
    }, [savedAssessmentType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewAssessmentTypeModal(!isVisibleNewAssessmentTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Assessment Type" /> Add New Assessment Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={assessmentTypes}
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
                            ? `Could not retrieve assessment types due to ${error}. Please try again.`
                            : 'No assessment types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedAssessmentType}
                                isVisibleEditModal={isVisibleEditAssessmentTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditAssessmentTypeModal}
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
            {isVisibleNewAssessmentTypeModal && (
                <NewAssessmentTypeForm
                    visibility={isVisibleNewAssessmentTypeModal}
                    setAssessmentTypeModalVisibility={setIsVisibleNewAssessmentTypeModal}
                    createdAssessmentTypeCallBack={setCreatedAssessmentTypeAndRefreshAssessmentTypes}
                />
            )}
            {isVisibleEditAssessmentTypeModal && (
                <EditAssessmentTypeForm
                    assessmentType={selectedAssessmentType}
                    visibility={isVisibleEditAssessmentTypeModal}
                    setEditAssessmentTypeModalVisibility={setIsVisibleEditAssessmentTypeModal}
                    savedAssessmentTypeCallBack={setSavedAssessmentTypeAndRefreshAssessmentTypes}
                />
            )}
            <CToaster ref={assessmentTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
