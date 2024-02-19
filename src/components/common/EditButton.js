import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';
import PropTypes from 'prop-types';

export function EditButton({ item, setSelectedItem, setIsVisibleEditModal, isVisibleEditModal }) {
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="ghost"
                size="sm"
                onClick={() => {
                    setSelectedItem(item);
                    setIsVisibleEditModal(!isVisibleEditModal);
                }}
            >
                <CIcon icon={cilPencil} title={`Edit ${item.name}`} />
            </CButton>
        </td>
    );
}

EditButton.propTypes = {
    item: PropTypes.object.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    setIsVisibleEditModal: PropTypes.func.isRequired,
    isVisibleEditModal: PropTypes.bool.isRequired,
};
