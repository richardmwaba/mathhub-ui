import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CLoadingButton,
    CFormText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import ExamBoardsService from 'src/api/sis/exam-boards.service';

export default function NewExamBoardForm({ visibility, setExamBoardModalVisibility, createdExamBoardCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const defaultExamBoard = {
        name: '',
        description: '',
    };
    const errorRef = useRef();
    const examBoardNameRef = useRef();

    const [errorMessage, setErrorMessage] = useState('');
    const [isCreateExamBoardFormValidated, setIsCreateExamBoardFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newExamBoard, setNewExamBoard] = useState(defaultExamBoard);

    useEffect(() => {
        examBoardNameRef.current.focus();
    }, []);

    const handleCreateNewExamBoard = async (event) => {
        const newExamBoardForm = event.currentTarget;

        if (newExamBoardForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExamBoardsService.createExamBoard(newExamBoard, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewExamBoard(defaultExamBoard);
                    setExamBoardModalVisibility(!visibility);
                    createdExamBoardCallBack(response);
                },
                (error) => {
                    if (!error?.response) {
                        setErrorMessage('No server response');
                    }

                    setErrorMessage(error.message);
                    errorRef.current?.focus();
                },
            );
        }

        setIsLoading(false);
        setIsCreateExamBoardFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setExamBoardModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Exam Board</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new exam board. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateExamBoardFormValidated}
                                        onSubmit={handleCreateNewExamBoard}
                                        id="createNewExamBoardForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Exam Board Name"
                                            autoComplete="off"
                                            id="examBoardName"
                                            label="Name"
                                            required
                                            ref={examBoardNameRef}
                                            value={newExamBoard.name}
                                            aria-describedby="ezamBoardNameInputGroup"
                                            onChange={(e) => {
                                                setNewExamBoard((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Exam Board Description"
                                            autoComplete="off"
                                            id="examBoardDescription"
                                            label="Description"
                                            required
                                            value={newExamBoard.description}
                                            onChange={(e) => {
                                                setNewExamBoard((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setExamBoardModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewExamBoardForm" loading={isLoading} type="submit">
                    Save Exam Board
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewExamBoardForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setExamBoardModalVisibility: PropTypes.func.isRequired,
    createdExamBoardCallBack: PropTypes.func.isRequired,
};
