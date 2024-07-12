/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import CIcon from '@coreui/icons-react';
import NewAssetForm from './NewAssetForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditAssetForm from './EditAssetForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';
import AssetsService from 'src/api/cashbook/assets.service';

export default function AssetsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [assets, setAssets] = useState([]);
    const [createdAsset, setCreatedAsset] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditAssetModal, setIsVisibleEditAssetModal] = useState(false);
    const [isVisibleNewAssetModal, setIsVisibleNewAssetModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAsset, setSavedAsset] = useState({});
    const [selectedAsset, setSelectedAsset] = useState({});
    const [toast, setToast] = useState(0);

    const assetActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'narration', label: 'Name', _style: { width: '30%' } },
        {
            key: 'type',
            label: 'Asset Type',
            _style: { width: '30%' },
        },
        {
            key: 'amount',
            label: 'Amount',
            _style: { width: '20%' },
        },
        {
            key: 'paymentMethod',
            label: 'Pament Method',
            _style: { width: '20%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getAssets = async () => {
        const response = await AssetsService.getAllAssets(axiosPrivate, controller, setError);
        isMounted && setAssets(response);
        setLoading(false);
    };

    const setCreatedAssetAndRefreshAssets = (newAsset) => {
        setCreatedAsset(newAsset);
        getAssets();
    };

    const setSavedAssetAndRefreshAssets = (savedEditedAsset) => {
        setSavedAsset(savedEditedAsset);
        getAssets();
    };

    const formatAssets = (assetsList) => {
        return assetsList.map((asset) => {
            return {
                id: asset.id,
                narration: asset.narration,
                type: asset.type.name,
                amount: asset.amount,
                paymentMethod: asset.paymentMethod.name,
                createdBy: asset.createdBy,
            };
        });
    };

    // get asset types data from api
    useEffect(() => {
        getAssets();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const assetSuccessfullyCreatedToast = <SuccessToast message={'New asset has been created successfully'} />;

        if (createdAsset?.narration) {
            setToast(assetSuccessfullyCreatedToast);
        }
    }, [createdAsset]);

    useEffect(() => {
        const assetSuccessfullyEditedToast = <SuccessToast message={'Asset has been updated successfully'} />;

        if (savedAsset?.narration) {
            setToast(assetSuccessfullyEditedToast);
        }
    }, [savedAsset]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewAssetModal(!isVisibleNewAssetModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Asset" /> Add New Asset
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={formatAssets(assets)}
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
                        error ? `Could not retrieve assets due to ${error}. Please try again.` : 'No assets found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={assets.find((asset) => asset.id === item.id)}
                                setSelectedItem={setSelectedAsset}
                                isVisibleEditModal={isVisibleEditAssetModal}
                                setIsVisibleEditModal={setIsVisibleEditAssetModal}
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
            {isVisibleNewAssetModal && (
                <NewAssetForm
                    visibility={isVisibleNewAssetModal}
                    setAssetModalVisibility={setIsVisibleNewAssetModal}
                    createdAssetCallBack={setCreatedAssetAndRefreshAssets}
                />
            )}
            {isVisibleEditAssetModal && (
                <EditAssetForm
                    asset={selectedAsset}
                    visibility={isVisibleEditAssetModal}
                    setEditAssetModalVisibility={setIsVisibleEditAssetModal}
                    savedAssetCallBack={setSavedAssetAndRefreshAssets}
                />
            )}
            <CToaster ref={assetActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
