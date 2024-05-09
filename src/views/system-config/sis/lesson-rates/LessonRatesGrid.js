/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import { EditButton } from 'src/components/common/EditButton';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { SuccessToast } from 'src/components/common/SuccessToast';
import NewLessonRateForm from './NewLessonRateForm';
import EditLessonRateForm from './EditLessonRateForm';
import LessonRatesService from 'src/api/system-config/sis/lesson-rates.service';
import DateUtils from 'src/utils/dateUtils';

export default function LessonRatesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [lessonRates, setLessonRates] = useState([]);
    const [createdLessonRate, setCreatedLessonRate] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditLessonRateModal, setIsVisibleEditLessonRateModal] = useState(false);
    const [isVisibleNewLessonRateModal, setIsVisibleNewLessonRateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedLessonRate, setSavedLessonRate] = useState({});
    const [selectedLessonRate, setSelectedLessonRate] = useState({});
    const [toast, setToast] = useState(0);

    const subjectActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'subjectComplexity', label: 'Subject Complexity', _style: { width: '30%' } },
        {
            key: 'amountPerLesson',
            label: 'Amount Per Lesson (ZMW)',
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

    const getLessonRates = async () => {
        const response = await LessonRatesService.getAllLessonRates(
            axiosPrivate,
            controller,
            setError,
        );
        isMounted && setLessonRates(response);
        setLoading(false);
    };

    const setCreatedLessonRateAndRefreshLessonRates = (newLessonRate) => {
        setCreatedLessonRate(newLessonRate);
        getLessonRates();
    };

    const setSavedLessonRateAndRefreshLessonRates = (savedEditedLessonRate) => {
        setSavedLessonRate(savedEditedLessonRate);
        getLessonRates();
    };

    const formatLessonRates = (lessonRatesList) => {
        return lessonRatesList.map((lessonRate) => {
            return {
                id: lessonRate.id,
                amountPerLesson: lessonRate.amountPerLesson,
                effectiveDate: DateUtils.formatDate(lessonRate.effectiveDate),
                subjectComplexity: lessonRate.subjectComplexity,
                expiryDate: DateUtils.formatDate(lessonRate.expiryDate),
            };
        });
    };

    // get lesson rates data from api
    useEffect(() => {
        getLessonRates();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const subjectSuccessfullyCreatedToast = (
            <SuccessToast message={`New lesson rate has been created successfully`} />
        );

        if (createdLessonRate?.amountPerLesson) {
            setToast(subjectSuccessfullyCreatedToast);
        }
    }, [createdLessonRate]);

    useEffect(() => {
        const subjectSuccessfullyEditedToast = (
            <SuccessToast message={`Lesson rate has been updated successfully`} />
        );

        if (savedLessonRate?.amountPerLesson) {
            setToast(subjectSuccessfullyEditedToast);
        }
    }, [savedLessonRate]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewLessonRateModal(!isVisibleNewLessonRateModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Lesson Rate" /> Add New Lesson Rate
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'name', state: 'asc' }}
                    items={formatLessonRates(lessonRates)}
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
                            ? `Could not retrieve lesson rates due to ${error}. Please try again.`
                            : 'No lesson rates found'
                    }
                    scopedColumns={{
                        show_details: (currentLessonRate) => (
                            <EditButton
                                item={lessonRates.find(
                                    (lessonRate) => lessonRate.id === currentLessonRate.id,
                                )}
                                setSelectedItem={setSelectedLessonRate}
                                isVisibleEditModal={isVisibleEditLessonRateModal}
                                setIsVisibleEditModal={setIsVisibleEditLessonRateModal}
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
            {isVisibleNewLessonRateModal && (
                <NewLessonRateForm
                    visibility={isVisibleNewLessonRateModal}
                    setLessonRateModalVisibility={setIsVisibleNewLessonRateModal}
                    createdLessonRateCallBack={setCreatedLessonRateAndRefreshLessonRates}
                />
            )}
            {isVisibleEditLessonRateModal && (
                <EditLessonRateForm
                    lessonRate={selectedLessonRate}
                    visibility={isVisibleEditLessonRateModal}
                    setEditLessonRateModalVisibility={setIsVisibleEditLessonRateModal}
                    savedLessonRateCallBack={setSavedLessonRateAndRefreshLessonRates}
                />
            )}
            <CToaster ref={subjectActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
