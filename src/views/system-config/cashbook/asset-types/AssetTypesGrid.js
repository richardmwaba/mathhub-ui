/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import AssetTypesService from 'src/api/system-config/cashbook/asset-types.service';
import CIcon from '@coreui/icons-react';
import NewAssetTypeForm from './NewAssetTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditAssetTypeForm from './EditAssetTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function AssetTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [assetTypes, setAssetTypes] = useState([]);
    const [createdAssetType, setCreatedAssetType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditAssetTypeModal, setIsVisibleEditAssetTypeModal] = useState(false);
    const [isVisibleNewAssetTypeModal, setIsVisibleNewAssetTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAssetType, setSavedAssetType] = useState({});
    const [selectedAssetType, setSelectedAssetType] = useState({});
    const [toast, setToast] = useState(0);

    const assetTypeActionSuccessToasterRef = useRef();

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

    const getAssetTypes = async () => {
        const response = await AssetTypesService.getAllAssetTypes(
            axiosPrivate,
            controller,
            setError,
        );
        isMounted && setAssetTypes(response);
        setLoading(false);
    };

    const setCreatedAssetTypeAndRefreshAssetTypes = (newAssetType) => {
        setCreatedAssetType(newAssetType);
        getAssetTypes();
    };

    const setSavedAssetTypeAndRefreshAssetTypes = (savedEditedAssetType) => {
        setSavedAssetType(savedEditedAssetType);
        getAssetTypes();
    };

    // get asset types data from api
    useEffect(() => {
        getAssetTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const assetTypeSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Asset type ${createdAssetType?.typeName} has been created successfully`}
            />
        );

        if (createdAssetType?.typeName) {
            setToast(assetTypeSuccessfullyCreatedToast);
        }
    }, [createdAssetType]);

    useEffect(() => {
        const assetTypeSuccessfullyEditedToast = (
            <SuccessToast
                message={`Asset type ${savedAssetType?.typeName} has been updated successfully`}
            />
        );

        if (savedAssetType?.typeName) {
            setToast(assetTypeSuccessfullyEditedToast);
        }
    }, [savedAssetType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewAssetTypeModal(!isVisibleNewAssetTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Asset Type" /> Add New Asset Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={assetTypes}
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
                            ? `Could not retrieve asset types due to ${error}. Please try again.`
                            : 'No asset types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedAssetType}
                                isVisibleEditModal={isVisibleEditAssetTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditAssetTypeModal}
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
            {isVisibleNewAssetTypeModal && (
                <NewAssetTypeForm
                    visibility={isVisibleNewAssetTypeModal}
                    setAssetTypeModalVisibility={setIsVisibleNewAssetTypeModal}
                    createdAssetTypeCallBack={setCreatedAssetTypeAndRefreshAssetTypes}
                />
            )}
            {isVisibleEditAssetTypeModal && (
                <EditAssetTypeForm
                    assetType={selectedAssetType}
                    visibility={isVisibleEditAssetTypeModal}
                    setEditAssetTypeModalVisibility={setIsVisibleEditAssetTypeModal}
                    savedAssetTypeCallBack={setSavedAssetTypeAndRefreshAssetTypes}
                />
            )}
            <CToaster ref={assetTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
