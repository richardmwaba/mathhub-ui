function getAllUsers(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/ops/users', { signal: controller.signal })
        .then((response) => {
            let users = [];

            const usersList = response.data._embedded.userList;

            users = usersList.map((user) => {
                const userRoles = user.userRoles.map((userRole) => {
                    return getReadableUserRole(userRole.roleName);
                });

                return {
                    id: user.userId,
                    name: `${user.firstName} ${user.lastName}`,
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

const getReadableUserRole = (userRole) => {
    switch (userRole) {
        case 'ROLE_ADMIN':
            return 'Admin';
        case 'ROLE_TEACHER':
            return 'Teacher';
        case 'ROLE_STUDENT':
            return 'Student';
        case 'ROLE_PARENT':
            return 'Parent';
        case 'ROLE_Cashier':
            return 'Cashier';
        default:
            return '';
    }
};

const UsersService = { getAllUsers };

export default UsersService;
