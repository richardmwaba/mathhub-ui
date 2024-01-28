function getAllUsers(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/users', { signal: controller.signal })
        .then((response) => {
            let users = [];

            const usersList = response.data._embedded.userList;

            users = usersList.map((user) => {
                const userRoles = user.userRoles.map((userRole) => {
                    return userRole.role;
                });

                const fullName = user.middleName
                    ? `${user.firstName} ${user.middleName} ${user.lastName}`
                    : `${user.firstName} ${user.lastName}`;

                return {
                    id: user.userId,
                    username: user.username,
                    name: fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    userRoles: userRoles,
                };
            });

            return users;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createUser(newUser, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/ops/users', newUser, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function getAllUserRoles() {
    return [
        { value: 'Administrator', text: 'Administrator' },
        { value: 'Teacher', text: 'Teacher' },
        { value: 'Student', text: 'Student' },
        { value: 'Parent', text: 'Parent' },
        { value: 'Cashier', text: 'Cashier' },
    ];
}

const UsersService = { createUser, getAllUsers, getAllUserRoles };

export default UsersService;
