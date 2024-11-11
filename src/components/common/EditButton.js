import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react-pro';
import React from 'react';
import PropTypes from 'prop-types';

export function EditButton({
    item,
    isInGrid = true,
    setSelectedItem,
    setIsVisibleEditModal,
    isVisibleEditModal,
    shape,
    buttonText,
    variant,
}) {
    return isInGrid ? (
        <td className="py-2">
            <DefaultEditButton
                item={item}
                shape={shape}
                variant={variant}
                buttonText={buttonText}
                setSelectedItem={setSelectedItem}
                setIsVisibleEditModal={setIsVisibleEditModal}
                isVisibleEditModal={isVisibleEditModal}
            />
        </td>
    ) : (
        <DefaultEditButton
            item={item}
            shape={shape}
            variant={variant}
            buttonText={buttonText}
            setSelectedItem={setSelectedItem}
            setIsVisibleEditModal={setIsVisibleEditModal}
            isVisibleEditModal={isVisibleEditModal}
        />
    );
}

function DefaultEditButton({
    item,
    shape,
    variant,
    buttonText,
    setSelectedItem,
    setIsVisibleEditModal,
    isVisibleEditModal,
}) {
    return (
        <CButton
            color="primary"
            size="sm"
            shape={shape ?? 'rounded'}
            variant={variant ?? 'ghost'}
            onClick={() => {
                setSelectedItem(item);
                setIsVisibleEditModal(!isVisibleEditModal);
            }}
        >
            <CIcon icon={cilPencil} title={`Edit ${item.name}`} size="sm" /> {buttonText ?? ''}
        </CButton>
    );
}

DefaultEditButton.propTypes = {
    item: PropTypes.object.isRequired,
    shape: PropTypes.string,
    variant: PropTypes.string,
    buttonText: PropTypes.string,
    setSelectedItem: PropTypes.func.isRequired,
    setIsVisibleEditModal: PropTypes.func.isRequired,
    isVisibleEditModal: PropTypes.bool.isRequired,
};

EditButton.propTypes = {
    item: PropTypes.object.isRequired,
    isInGrid: PropTypes.bool,
    setSelectedItem: PropTypes.func.isRequired,
    setIsVisibleEditModal: PropTypes.func.isRequired,
    isVisibleEditModal: PropTypes.bool.isRequired,
    shape: PropTypes.string,
    buttonText: PropTypes.string,
    variant: PropTypes.string,
};
