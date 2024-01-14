function getAllExamBoards(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/examBoards', { signal: controller.signal })
        .then((response) => {
            let examBoards = [];

            const examBoardsList = response.data._embedded.examBoardDtoList;

            examBoards = examBoardsList.map((examBoard) => {
                return {
                    id: examBoard.examBoardId,
                    type: examBoard.examBoardName,
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

const ExamBoardsService = { getAllExamBoards };

export default ExamBoardsService;
