import React, { useState, useEffect, useRef } from 'react';
import {
    CAvatar,
    CCardBody,
    CButton,
    CCollapse,
    CSmartTable,
    CToast,
    CToastBody,
    CToastClose,
    CToaster,
    CTableBody,
    CTableRow,
    CTableDataCell,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
    cilArrowThickToBottom,
    cilChevronCircleDownAlt,
    cilChevronCircleUpAlt,
    cilPencil,
    cilTrash,
    cilUserPlus,
} from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import UserRegistrationForm from './UserRegistrationForm';
import avatar1 from 'src/assets/images/avatars/1.jpg';
import PropTypes from 'prop-types';
import UserEditForm from './UserEditForm';
import UserDeletionConfirmation from './UserDeletionConfirmation';

export default function UsersGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [toast, setToast] = useState(0);
    const [loading, setLoading] = useState();
    const [details, setDetails] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [createdUser, setCreatedUser] = useState({});
    const [savedEditedUser, setSavedEditedUser] = useState({});
    const [deleteUserResponse, setDeleteUserResponse] = useState({});
    const [deletedUserFullname, setDeletedUserFullname] = useState('');
    const [selectedUser, setSelectedUser] = useState({});
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isVisibleNewUserModal, setIsVisibleNewUserModal] = useState(false);
    const [isVisibleEditUserModal, setIsVisibleEditUserModal] = useState(false);
    const [isVisibleDeleteUserModal, setIsVisibleDeleteUserModal] = useState(false);

    const userActionSuccessToasterRef = useRef();

    const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n');

    const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

    const columns = [
        {
            key: 'name',
            label: 'Name',
            _style: { width: '30%' },
        },
        {
            key: 'email',
            label: 'Email',
            _style: { width: '20%' },
        },
        {
            key: 'phoneNumber',
            label: 'Phone Number',
            _style: { width: '20%' },
        },
        {
            key: 'userRoles',
            label: 'User Roles',
            _style: { width: '30%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const toggleDetails = (index) => {
        const position = details.indexOf(index);
        let newDetails = details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...details, index];
        }
        setDetails(newDetails);
    };

    const setUserModalVisibility = () => {
        setIsVisibleNewUserModal(!isVisibleNewUserModal);
    };

    let isMounted = true;
    const getUsers = async () => {
        const response = await UsersService.getAllUsers(axiosPrivate, controller, setError);
        isMounted && setUsers(response) && setCurrentItems(response);
    };

    // get students data from api
    useEffect(() => {
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const setCreatedUserAndRefreshUsers = (newUser) => {
        setCreatedUser(newUser);
        getUsers();
    };

    const setSavedEditedUserAndRefreshUsers = (savedEditedUser) => {
        setSavedEditedUser(savedEditedUser);
        getUsers();
    };

    const setDeleteUserResponseAndRefreshUsers = (userFullname, response) => {
        setDeleteUserResponse(response);
        setDeletedUserFullname(userFullname);
        getUsers();
    };

    useEffect(() => {
        const userSuccessfullyCreatedToast = (
            <SuccessToast
                message={`User ${createdUser?.firstName} has been created successfully`}
            />
        );

        if (createdUser?.firstName) {
            setToast(userSuccessfullyCreatedToast);
        }
    }, [createdUser]);

    useEffect(() => {
        const userSuccessfullyEditedToast = (
            <SuccessToast
                message={`User ${savedEditedUser?.firstName} has been updated successfully`}
            />
        );

        if (savedEditedUser?.firstName) {
            setToast(userSuccessfullyEditedToast);
        }
    }, [savedEditedUser]);

    useEffect(() => {
        const userSuccessfullyDeletedToast = (
            <SuccessToast message={`User ${deletedUserFullname} has been deleted successfully`} />
        );

        if (deleteUserResponse.status === 200 && deletedUserFullname) {
            setToast(userSuccessfullyDeletedToast);
        }
    }, [deletedUserFullname, deleteUserResponse]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewUserModal(!isVisibleNewUserModal)}
                >
                    <CIcon icon={cilUserPlus} title="Add New User" /> Add New User
                </CButton>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    href={csvCode}
                    style={{ marginLeft: 10 }}
                    download="users-data.csv"
                    target="_blank"
                >
                    <CIcon icon={cilArrowThickToBottom} title="Download file" /> (.csv)
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'name', state: 'asc' }}
                    columns={columns}
                    itemsPerPage={10}
                    columnFilter
                    columnSorter
                    items={users}
                    itemsPerPageSelect
                    tableFilter
                    cleaner
                    loading={loading}
                    pagination
                    scopedColumns={{
                        show_details: (user) => {
                            return ToggleButton(toggleDetails, user, details);
                        },
                        details: (user) => {
                            return (
                                <DetailsCard
                                    details={details}
                                    user={user}
                                    setSelectedUser={setSelectedUser}
                                    setIsVisibleEditUserModal={setIsVisibleEditUserModal}
                                    isVisibleEditUserModal={isVisibleEditUserModal}
                                    setIsVisibleDeleteUserModal={setIsVisibleDeleteUserModal}
                                    isVisibleDeleteUserModal={isVisibleDeleteUserModal}
                                />
                            );
                        },
                        selectUser: (user) => {
                            setSelectedUser(user);
                        },
                    }}
                    tableProps={{
                        hover: true,
                        responsive: true,
                        striped: true,
                    }}
                />
            </CCardBody>
            {isVisibleNewUserModal && (
                <UserRegistrationForm
                    visibility={isVisibleNewUserModal}
                    setUserModalVisibility={setUserModalVisibility}
                    createdUserCallBack={setCreatedUserAndRefreshUsers}
                />
            )}
            {isVisibleEditUserModal && (
                <UserEditForm
                    user={selectedUser}
                    visibility={isVisibleEditUserModal}
                    setEditUserModalVisibility={setIsVisibleEditUserModal}
                    savedUserCallBack={setSavedEditedUserAndRefreshUsers}
                />
            )}
            {isVisibleDeleteUserModal && (
                <UserDeletionConfirmation
                    user={selectedUser}
                    visibility={isVisibleDeleteUserModal}
                    setDeleteUserModalVisibility={setIsVisibleDeleteUserModal}
                    savedUserCallBack={setDeleteUserResponseAndRefreshUsers}
                />
            )}
            <CToaster ref={userActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}

function DetailsCard({
    details,
    user,
    setSelectedUser,
    setIsVisibleEditUserModal,
    isVisibleEditUserModal,
    setIsVisibleDeleteUserModal,
    isVisibleDeleteUserModal,
}) {
    return (
        <CCollapse visible={details.includes(user.id)}>
            <CCardBody>
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell className="text-center">
                            <CAvatar size="md" src={avatar1} />
                        </CTableDataCell>
                        <CTableDataCell>
                            <div style={{ marginLeft: 15 }}>{user.username}</div>
                            <div
                                className="small text-disabled text-nowrap"
                                style={{ marginLeft: 5 }}
                            >
                                <span>
                                    <CButton
                                        color="primary"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setIsVisibleEditUserModal(!isVisibleEditUserModal);
                                        }}
                                    >
                                        <CIcon icon={cilPencil} title="Edit user" />
                                    </CButton>
                                </span>{' '}
                                |{' '}
                                <CButton
                                    color="danger"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsVisibleDeleteUserModal(!isVisibleDeleteUserModal);
                                    }}
                                >
                                    <CIcon icon={cilTrash} title="Delete user" />
                                </CButton>
                            </div>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CCardBody>
        </CCollapse>
    );
}

DetailsCard.propTypes = {
    details: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    setSelectedUser: PropTypes.func.isRequired,
    setIsVisibleEditUserModal: PropTypes.func.isRequired,
    isVisibleEditUserModal: PropTypes.bool.isRequired,
    setIsVisibleDeleteUserModal: PropTypes.func.isRequired,
    isVisibleDeleteUserModal: PropTypes.bool.isRequired,
};

function ToggleButton(toggleDetails, item, details) {
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="ghost"
                shape="square"
                size="sm"
                onClick={() => {
                    toggleDetails(item.id);
                }}
            >
                {details.includes(item.id) ? (
                    <CIcon icon={cilChevronCircleUpAlt} title="Hide" />
                ) : (
                    <CIcon icon={cilChevronCircleDownAlt} title="See More" />
                )}
            </CButton>
        </td>
    );
}

function SuccessToast({ message }) {
    return (
        <CToast visible={true} color="success" className="text-white align-items-center">
            <div className="d-flex">
                <CToastBody>{message}</CToastBody>
                <CToastClose className="me-2 m-auto" white />
            </div>
        </CToast>
    );
}

SuccessToast.propTypes = {
    message: PropTypes.string.isRequired,
};
