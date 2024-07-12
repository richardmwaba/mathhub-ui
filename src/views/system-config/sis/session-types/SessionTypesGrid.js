/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import SessionTypesService from 'src/api/system-config/sis/session-types.service';
import CIcon from '@coreui/icons-react';
import NewSessionTypeForm from './NewSessionTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditSessionTypeForm from './EditSessionTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function SessionTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [sessionTypes, setSessionTypes] = useState([]);
    const [createdSessionType, setCreatedSessionType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditSessionTypeModal, setIsVisibleEditSessionTypeModal] = useState(false);
    const [isVisibleNewSessionTypeModal, setIsVisibleNewSessionTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedSessionType, setSavedSessionType] = useState({});
    const [selectedSessionType, setSelectedSessionType] = useState({});
    const [toast, setToast] = useState(0);

    const sessionTypeActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'name', label: 'Name', _style: { width: '40%' } },
        {
            key: 'description',
            label: 'Description',
            _style: { width: '60%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getSessionTypes = async () => {
        const response = await SessionTypesService.getAllSessionTypes(
            axiosPrivate,
            controller,
            setError,
        );
        isMounted && setSessionTypes(response);
        setLoading(false);
    };

    const setCreatedSessionTypeAndRefreshSessionTypes = (newSessionType) => {
        setCreatedSessionType(newSessionType);
        getSessionTypes();
    };

    const setSavedSessionTypeAndRefreshSessionTypes = (savedEditedSessionType) => {
        setSavedSessionType(savedEditedSessionType);
        getSessionTypes();
    };

    // get session types data from api
    useEffect(() => {
        getSessionTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const sessionTypeSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Session type ${createdSessionType?.name} has been created successfully`}
            />
        );

        if (createdSessionType?.name) {
            setToast(sessionTypeSuccessfullyCreatedToast);
        }
    }, [createdSessionType]);

    useEffect(() => {
        const sessionTypeSuccessfullyEditedToast = (
            <SuccessToast
                message={`Session type ${savedSessionType?.name} has been updated successfully`}
            />
        );

        if (savedSessionType?.name) {
            setToast(sessionTypeSuccessfullyEditedToast);
        }
    }, [savedSessionType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewSessionTypeModal(!isVisibleNewSessionTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Session Type" /> Add New Session Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={sessionTypes}
                    columns={columns}
                    itemsPerPage={10}
                    columnFilter
                    columnSorter
                    tableFilter
                    loading={loading}
                    cleaner
                    itemsPerPageSelect
                    pagination
                    noItemsLabel={
                        error
                            ? `Could not retrieve session types due to ${error}. Please try again.`
                            : 'No session types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedSessionType}
                                isVisibleEditModal={isVisibleEditSessionTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditSessionTypeModal}
                            />
                        ),
                    }}
                    tableProps={{
                        hover: true,
                        responsive: true,
                        striped: true,
                    }}
                />
            </CCardBody>
            {isVisibleNewSessionTypeModal && (
                <NewSessionTypeForm
                    visibility={isVisibleNewSessionTypeModal}
                    setSessionTypeModalVisibility={setIsVisibleNewSessionTypeModal}
                    createdSessionTypeCallBack={setCreatedSessionTypeAndRefreshSessionTypes}
                />
            )}
            {isVisibleEditSessionTypeModal && (
                <EditSessionTypeForm
                    sessionType={selectedSessionType}
                    visibility={isVisibleEditSessionTypeModal}
                    setEditSessionTypeModalVisibility={setIsVisibleEditSessionTypeModal}
                    savedSessionTypeCallBack={setSavedSessionTypeAndRefreshSessionTypes}
                />
            )}
            <CToaster
                ref={sessionTypeActionSuccessToasterRef}
                push={toast}
                placement="bottom-end"
            />
        </>
    );
}
