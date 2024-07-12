function getAllExamBoards(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/examBoards', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.examBoardList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createExamBoard(newExamBoard, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/sis/examBoards', newExamBoard, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editExamBoard(editedExamBoard, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/sis/examBoards/${editedExamBoard.id}`, editedExamBoard, {
            signal: controller.signal,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const ExamBoardsService = { createExamBoard, editExamBoard, getAllExamBoards };

export default ExamBoardsService;
