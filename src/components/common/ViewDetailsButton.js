import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export function ViewDetailsButton({ item, detailsLocation, setSelectedItem }) {
    const navigate = useNavigate();
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="ghost"
                size="sm"
                onClick={() => {
                    setSelectedItem(item);
                    navigate(detailsLocation, { state: item });
                }}
            >
                <CIcon icon={cilInfo} title={`View ${item.name}`} />
            </CButton>
        </td>
    );
}

ViewDetailsButton.propTypes = {
    item: PropTypes.object.isRequired,
    detailsLocation: PropTypes.string.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
};
