function getAllExamBoards(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/examBoards', { signal: controller.signal })
        .then((response) => {
            let examBoards = [];

            const examBoardsList = response.data._embedded.examBoardDtoList;

            examBoards = examBoardsList.map((examBoard) => {
                return {
                    id: examBoard.examBoardId,
                    name: examBoard.examBoardName,
                    description: examBoard.examBoardDescription,
                };
            });

            return examBoards;
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
        .put(`/sis/examBoards/${editedExamBoard.examBoardId}`, editedExamBoard, {
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
