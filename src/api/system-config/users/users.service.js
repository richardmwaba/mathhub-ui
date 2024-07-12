function getAllUsers(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/users', { signal: controller.signal })
        .then((response) => {
            let users = [];

            const usersList = response.data._embedded.userList;

            users = usersList.map((user) => {
                const roles = user.roles.map((role) => {
                    return role.name;
                });

                const fullName = user.middleName
                    ? `${user.firstName} ${user.middleName} ${user.lastName}`
                    : `${user.firstName} ${user.lastName}`;

                return {
                    id: user.id,
                    username: user.username,
                    name: fullName,
                    email: user.email,
                    gender: user.gender,
                    phoneNumber: user.phoneNumber,
                    roles: roles,
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

function editUser(editedUser, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/ops/users/${editedUser.id}`, editedUser, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function deleteUser(id, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .delete(`/ops/users/${id}`, { signal: controller.signal })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function getAllUserRoles() {
    return [
        { value: 'Administrator', label: 'Administrator' },
        { value: 'Guest', label: 'Guest' },
        { value: 'Cashier', label: 'Cashier' },
        { value: 'Parent', label: 'Parent' },
        { value: 'Student', label: 'Student' },
        { value: 'Teacher', label: 'Teacher' },
    ];
}

function getGenderOptions() {
    return [
        { value: '', label: 'Select your gender...' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
        { value: 'Prefer not to say', label: 'Prefer not to say' },
    ];
}

const UsersService = {
    createUser,
    editUser,
    deleteUser,
    getAllUsers,
    getAllUserRoles,
    getGenderOptions,
};

export default UsersService;
