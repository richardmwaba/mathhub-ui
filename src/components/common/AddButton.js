import { cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';
import PropTypes from 'prop-types';

export function DefaultAddButton({ buttonText, shape, variant, setIsVisibleAddModal, isVisibleAddModal }) {
    return (
        <CButton
            color="primary"
            size="sm"
            shape={shape ?? 'rounded'}
            variant={variant ?? 'ghost'}
            onClick={() => {
                setIsVisibleAddModal(!isVisibleAddModal);
            }}
        >
            <CIcon icon={cilPlus} title={buttonText} size="sm" /> {buttonText}
        </CButton>
    );
}

DefaultAddButton.propTypes = {
    buttonText: PropTypes.string.isRequired,
    shape: PropTypes.string,
    variant: PropTypes.string,
    setIsVisibleAddModal: PropTypes.func.isRequired,
    isVisibleAddModal: PropTypes.bool.isRequired,
};
