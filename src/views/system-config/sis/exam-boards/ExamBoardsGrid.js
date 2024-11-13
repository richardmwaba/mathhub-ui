/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import ExamBoardsService from 'src/api/sis/exam-boards.service';
import CIcon from '@coreui/icons-react';
import NewExamBoardForm from './NewExamBoardForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditExamBoardForm from './EditExamBoardForm';
import { GridEditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function ExamBoardsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [createdExamBoard, setCreatedExamBoard] = useState({});
    const [error, setError] = useState('');
    const [examBoards, setExamBoards] = useState([]);
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditExamBoardModal, setIsVisibleEditExamBoardModal] = useState(false);
    const [isVisibleNewExamBoardModal, setIsVisibleNewExamBoardModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedExamBoard, setSavedExamBoard] = useState({});
    const [selectedExamBoard, setSelectedExamBoard] = useState({});
    const [toast, setToast] = useState(0);

    const examBoardActionSuccessToasterRef = useRef();

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

    const getExamBoards = async () => {
        const response = await ExamBoardsService.getAllExamBoards(axiosPrivate, controller, setError);
        isMounted && setExamBoards(response);
        setLoading(false);
    };

    const setCreatedExamBoardAndRefreshExamBoards = (newExamBoard) => {
        setCreatedExamBoard(newExamBoard);
        getExamBoards();
    };

    const setSavedExamBoardAndRefreshExamBoards = (savedEditedExamBoard) => {
        setSavedExamBoard(savedEditedExamBoard);
        getExamBoards();
    };

    // get exam boards data from api
    useEffect(() => {
        getExamBoards();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const examBoardSuccessfullyCreatedToast = (
            <SuccessToast message={`Exam board ${createdExamBoard?.name} has been created successfully`} />
        );

        if (createdExamBoard?.name) {
            setToast(examBoardSuccessfullyCreatedToast);
        }
    }, [createdExamBoard]);

    useEffect(() => {
        const examBoardSuccessfullyEditedToast = (
            <SuccessToast message={`Exam board ${savedExamBoard?.name} has been updated successfully`} />
        );

        if (savedExamBoard?.name) {
            setToast(examBoardSuccessfullyEditedToast);
        }
    }, [savedExamBoard]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewExamBoardModal(!isVisibleNewExamBoardModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Exam Board" /> Add New Exam Board
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={examBoards}
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
                            <GridEditButton
                                item={item}
                                setSelectedItem={setSelectedExamBoard}
                                isVisibleEditModal={isVisibleEditExamBoardModal}
                                setIsVisibleEditModal={setIsVisibleEditExamBoardModal}
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
            {isVisibleNewExamBoardModal && (
                <NewExamBoardForm
                    visibility={isVisibleNewExamBoardModal}
                    setExamBoardModalVisibility={setIsVisibleNewExamBoardModal}
                    createdExamBoardCallBack={setCreatedExamBoardAndRefreshExamBoards}
                />
            )}
            {isVisibleEditExamBoardModal && (
                <EditExamBoardForm
                    examBoard={selectedExamBoard}
                    visibility={isVisibleEditExamBoardModal}
                    setEditExamBoardModalVisibility={setIsVisibleEditExamBoardModal}
                    savedExamBoardCallBack={setSavedExamBoardAndRefreshExamBoards}
                />
            )}
            <CToaster ref={examBoardActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
