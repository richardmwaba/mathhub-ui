/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
    CAvatar,
    CCardBody,
    CButton,
    CCollapse,
    CMultiSelect,
    CSmartTable,
    CToaster,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CTable,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowThickToBottom, cilPencil, cilTrash, cilUserPlus } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import UserRegistrationForm from './UserRegistrationForm';
import avatar1 from 'src/assets/images/avatars/1.jpg';
import PropTypes from 'prop-types';
import UserEditForm from './UserEditForm';
import UserDeletionConfirmation from './UserDeletionConfirmation';
import { SuccessToast } from 'src/components/common/SuccessToast';
import { ToggleButton } from 'src/components/common/ToggleButton';

export default function UsersGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [createdUser, setCreatedUser] = useState({});
    const [currentItems, setCurrentItems] = useState([]);
    const [deleteUserResponse, setDeleteUserResponse] = useState({});
    const [deletedUserFullname, setDeletedUserFullname] = useState('');
    const [details, setDetails] = useState([]);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleDeleteUserModal, setIsVisibleDeleteUserModal] = useState(false);
    const [isVisibleEditUserModal, setIsVisibleEditUserModal] = useState(false);
    const [isVisibleNewUserModal, setIsVisibleNewUserModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedEditedUser, setSavedEditedUser] = useState({});
    const [selectedUser, setSelectedUser] = useState({});
    const [toast, setToast] = useState(0);
    const [users, setUsers] = useState([]);

    const userActionSuccessToasterRef = useRef();

    const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n');

    const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

    const columns = [
        {
            key: 'name',
            label: 'Name',
            _style: { width: '25%' },
        },
        {
            key: 'email',
            label: 'Email',
            _style: { width: '20%' },
        },
        {
            key: 'gender',
            label: 'Gender',
            _style: { width: '10%' },
        },
        {
            key: 'phoneNumber',
            label: 'Phone Number',
            _style: { width: '20%' },
        },
        {
            key: 'roles',
            label: 'Roles',
            _style: { width: '25%' },
            filter: (values, onChange) => multiSelectColumnFilter(values, onChange),
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

    const getUsers = async () => {
        const response = await UsersService.getAllUsers(axiosPrivate, controller, setError);
        if (isMounted) {
            setUsers(response);
            setCurrentItems(response);
        }
        setLoading(false);
    };

    // get students data from api
    useEffect(() => {
        getUsers();

        return () => {
            setIsMounted(false);
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
            <SuccessToast message={`User ${createdUser?.firstName} has been created successfully`} />
        );

        if (createdUser?.firstName) {
            setToast(userSuccessfullyCreatedToast);
        }
    }, [createdUser]);

    useEffect(() => {
        const userSuccessfullyEditedToast = (
            <SuccessToast message={`User ${savedEditedUser?.firstName} has been updated successfully`} />
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
                    noItemsLabel={
                        error ? `Could not retrieve users due to ${error}. Please try again.` : 'No users found'
                    }
                    scopedColumns={{
                        show_details: (user) => {
                            return ToggleButton(toggleDetails, user, details);
                        },
                        details: (user) => {
                            return (
                                <UserDetailsCard
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

function UserDetailsCard({
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
            <CCardBody color="light">
                <CTable align="middle" color="light">
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell style={{ width: '1%' }}>
                                <CAvatar size="md" src={avatar1} />
                            </CTableDataCell>
                            <CTableDataCell>
                                <div>{user.username}</div>
                                <div className="small text-disabled text-nowrap" style={{ marginLeft: -10 }}>
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
                                            <CIcon icon={cilPencil} title={`Edit ${user.name}`} />
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
                                        <CIcon icon={cilTrash} title={`Delete ${user.name}`} />
                                    </CButton>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCollapse>
    );
}

UserDetailsCard.propTypes = {
    details: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    setSelectedUser: PropTypes.func.isRequired,
    setIsVisibleEditUserModal: PropTypes.func.isRequired,
    isVisibleEditUserModal: PropTypes.bool.isRequired,
    setIsVisibleDeleteUserModal: PropTypes.func.isRequired,
    isVisibleDeleteUserModal: PropTypes.bool.isRequired,
};

function multiSelectColumnFilter(values, onChange) {
    const uniqueValues = [...new Set(values.flat())];
    return (
        <CMultiSelect
            size="sm"
            onChange={(selected) => {
                const _selected = selected.map((element) => {
                    return element.value;
                });
                onChange((item) => {
                    return Array.isArray(_selected) && _selected.length
                        ? _selected.includes(item.toString().toLowerCase())
                        : true;
                });
            }}
            options={uniqueValues
                .toSorted((a, b) => a < b)
                .map((element) => {
                    return {
                        value: element.toString().toLowerCase(),
                        label: element,
                    };
                })}
        />
    );
}
