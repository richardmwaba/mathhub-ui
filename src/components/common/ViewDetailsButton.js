import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';
import PropTypes from 'prop-types';

export function ViewDetailsButton({ item, setSelectedItem }) {
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="ghost"
                size="sm"
                onClick={() => {
                    setSelectedItem(item);
                }}
            >
                <CIcon icon={cilInfo} title={`View ${item.name}`} />
            </CButton>
        </td>
    );
}

ViewDetailsButton.propTypes = {
    item: PropTypes.object.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
};
