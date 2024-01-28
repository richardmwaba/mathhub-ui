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
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
    cilArrowThickToBottom,
    cilChevronCircleDownAlt,
    cilChevronCircleUpAlt,
    cilUserPlus,
} from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import UserRegistrationForm from './UserRegistrationForm';
import avatar1 from 'src/assets/images/avatars/1.jpg';
import PropTypes from 'prop-types';

export default function UsersGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [toast, addToast] = useState(0);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState();
    const [details, setDetails] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [createdUser, setCreatedUser] = useState({});
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isVisibleUserModal, setIsVisibleUserModal] = useState(false);

    const userCreatedToasterRef = useRef();

    const usersWithSelect = users?.map((user) => {
        const _selected = selected.includes(user.id);
        return {
            ...user,
            user,
            _selected,
            _classes: [user._classes, _selected && 'table-selected'],
        };
    });

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
        setIsVisibleUserModal(!isVisibleUserModal);
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

    const setCreatedCreatedUserAndRefreshUsers = (newUser) => {
        setCreatedUser(newUser);
        getUsers();
    };

    useEffect(() => {
        const userSuccessfullyCreatedToast = (
            <CToast visible={true} color="success" className="text-white align-items-center">
                <div className="d-flex">
                    <CToastBody>{`User ${createdUser?.firstName} has been created successfully`}</CToastBody>
                    <CToastClose className="me-2 m-auto" white />
                </div>
            </CToast>
        );

        if (createdUser?.firstName) {
            addToast(userSuccessfullyCreatedToast);
        }
    }, [createdUser]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleUserModal(!isVisibleUserModal)}
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
                    items={usersWithSelect}
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
                            return DetailsCard(details, user);
                        },
                    }}
                    tableProps={{
                        hover: true,
                        responsive: true,
                        striped: true,
                    }}
                />
            </CCardBody>
            {isVisibleUserModal && (
                <UserRegistrationForm
                    visibility={isVisibleUserModal}
                    setUserModalVisibility={setUserModalVisibility}
                    createdUserCallBack={setCreatedCreatedUserAndRefreshUsers}
                />
            )}
            <CToaster ref={userCreatedToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}

function DetailsCard(details, user) {
    return (
        <CCollapse visible={details.includes(user.id)}>
            <CCardBody>
                {/* <div>
                    <CAvatar size="md" src={avatar1} />
                    {user.name}
                </div>
                <div className="small text-disabled text-nowrap">
                    <span>{user.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                    {user.user.registered}
                </div>
                <CButton size="sm" color="info">
                    User Settings
                </CButton>
                <CButton size="sm" color="danger" className="ml-1">
                    Delete
                </CButton> */}
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell className="text-center">
                            <CAvatar size="md" src={avatar1} />
                        </CTableDataCell>
                        <CTableDataCell>
                            <div style={{ marginLeft: 15 }}>
                                <div>{user.username}</div>
                                <div className="small text-disabled text-nowrap">
                                    <span>{user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                                    {user.registered}
                                </div>
                            </div>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CCardBody>
        </CCollapse>
    );
}

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

function UserSuccessToast({ createdUser }) {
    return (
        <CToast visible={true} color="success" className="text-white align-items-center">
            <div className="d-flex">
                <CToastBody>{`User ${createdUser.firstName} has been created successfully`}</CToastBody>
                <CToastClose className="me-2 m-auto" white />
            </div>
        </CToast>
    );
}

UserSuccessToast.propTypes = {
    createdUser: PropTypes.object.isRequired,
};
