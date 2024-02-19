import { cilChevronCircleDownAlt, cilChevronCircleUpAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';

export function ToggleButton(toggleDetails, item, details) {
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="ghost"
                shape="square"
                size="sm"
                onClick={() => {
                    toggleDetails(item.id);
                }}
            >
                {details.includes(item.id) ? (
                    <CIcon icon={cilChevronCircleUpAlt} title="Hide" />
                ) : (
                    <CIcon icon={cilChevronCircleDownAlt} title="See More" />
                )}
            </CButton>
        </td>
    );
}
