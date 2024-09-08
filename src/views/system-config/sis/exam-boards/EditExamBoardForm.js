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

export default function EditExamBoardForm({
    examBoard,
    visibility,
    setEditExamBoardModalVisibility,
    savedExamBoardCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const defaultExamBoard = {
        id: examBoard.id,
        name: examBoard.name,
        description: examBoard.description,
    };
    const errorRef = useRef();
    const examBoardNameRef = useRef();

    const [editedExamBoard, setEditedExamBoard] = useState(defaultExamBoard);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditExamBoardFormValidated, setIsEditExamBoardFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        examBoardNameRef.current.focus();
    }, [examBoardNameRef]);

    const handleEditExamBoard = async (event) => {
        const editExamBoardForm = event.currentTarget;

        if (editExamBoardForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExamBoardsService.editExamBoard(editedExamBoard, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedExamBoard(defaultExamBoard);
                    setEditExamBoardModalVisibility(!visibility);
                    savedExamBoardCallBack(response);
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
        setIsEditExamBoardFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditExamBoardModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Exam Board</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the exam board. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditExamBoardFormValidated}
                                        onSubmit={handleEditExamBoard}
                                        id="editExamBoardForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Exam Board Name"
                                            autoComplete="off"
                                            id="examBoardName"
                                            label="Name"
                                            required
                                            ref={examBoardNameRef}
                                            value={editedExamBoard.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedExamBoard((prev) => {
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
                                            value={editedExamBoard.description}
                                            onChange={(e) => {
                                                setEditedExamBoard((prev) => {
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
                <CButton color="secondary" onClick={() => setEditExamBoardModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editExamBoardForm" loading={isLoading} type="submit">
                    Save Exam Board
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditExamBoardForm.propTypes = {
    examBoard: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditExamBoardModalVisibility: PropTypes.func.isRequired,
    savedExamBoardCallBack: PropTypes.func.isRequired,
};
