/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import { EditButton } from 'src/components/common/EditButton';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { SuccessToast } from 'src/components/common/SuccessToast';
import NewClassRateForm from './NewClassRateForm';
import EditClassRateForm from './EditClassRateForm';
import ClassRatesService from 'src/api/system-config/sis/class-rates.service';
import DateUtils from 'src/utils/dateUtils';

export default function ClassRatesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [classRates, setClassRates] = useState([]);
    const [createdClassRate, setCreatedClassRate] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditClassRateModal, setIsVisibleEditClassRateModal] = useState(false);
    const [isVisibleNewClassRateModal, setIsVisibleNewClassRateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedClassRate, setSavedClassRate] = useState({});
    const [selectedClassRate, setSelectedClassRate] = useState({});
    const [toast, setToast] = useState(0);

    const subjectActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'subjectComplexity', label: 'Subject Complexity', _style: { width: '30%' } },
        {
            key: 'amount',
            label: 'Amount Per Class (ZMW)',
            _style: { width: '30%' },
        },
        {
            key: 'expiryDate',
            label: 'Expiry Date',
            _style: { width: '40%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getClassRates = async () => {
        const response = await ClassRatesService.getAllclassRates(axiosPrivate, controller, setError);
        isMounted && setClassRates(response);
        setLoading(false);
    };

    const setCreatedClassRateAndRefreshClassRates = (newClassRate) => {
        setCreatedClassRate(newClassRate);
        getClassRates();
    };

    const setSavedClassRateAndRefreshClassRates = (savedEditedClassRate) => {
        setSavedClassRate(savedEditedClassRate);
        getClassRates();
    };

    const formatClassRates = (classRatesList) => {
        return classRatesList.map((classRate) => {
            return {
                id: classRate.id,
                amount: classRate.amount,
                effectiveDate: DateUtils.formatDate(classRate.effectiveDate),
                subjectComplexity: classRate.subjectComplexity,
                expiryDate: DateUtils.formatDate(classRate.expiryDate),
            };
        });
    };

    // get class rates data from api
    useEffect(() => {
        getClassRates();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const subjectSuccessfullyCreatedToast = (
            <SuccessToast message={`New class rate has been created successfully`} />
        );

        if (createdClassRate?.amount) {
            setToast(subjectSuccessfullyCreatedToast);
        }
    }, [createdClassRate]);

    useEffect(() => {
        const subjectSuccessfullyEditedToast = <SuccessToast message={`Class rate has been updated successfully`} />;

        if (savedClassRate?.amount) {
            setToast(subjectSuccessfullyEditedToast);
        }
    }, [savedClassRate]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewClassRateModal(!isVisibleNewClassRateModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Class Rate" /> Add New Class Rate
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'name', state: 'asc' }}
                    items={formatClassRates(classRates)}
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
                            ? `Could not retrieve class rates due to ${error}. Please try again.`
                            : 'No class rates found'
                    }
                    scopedColumns={{
                        show_details: (currentClassRate) => (
                            <EditButton
                                item={classRates.find((classRate) => classRate.id === currentClassRate.id)}
                                setSelectedItem={setSelectedClassRate}
                                isVisibleEditModal={isVisibleEditClassRateModal}
                                setIsVisibleEditModal={setIsVisibleEditClassRateModal}
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
            {isVisibleNewClassRateModal && (
                <NewClassRateForm
                    visibility={isVisibleNewClassRateModal}
                    setClassRateModalVisibility={setIsVisibleNewClassRateModal}
                    createdClassRateCallBack={setCreatedClassRateAndRefreshClassRates}
                />
            )}
            {isVisibleEditClassRateModal && (
                <EditClassRateForm
                    classRate={selectedClassRate}
                    visibility={isVisibleEditClassRateModal}
                    setEditClassRateModalVisibility={setIsVisibleEditClassRateModal}
                    savedClassRateCallBack={setSavedClassRateAndRefreshClassRates}
                />
            )}
            <CToaster ref={subjectActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
