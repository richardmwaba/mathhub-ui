import React from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react-pro';
import PropTypes from 'prop-types';

export function SuccessToast({ message }) {
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
