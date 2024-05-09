import React from 'react';
import { CFormInput } from '@coreui/react-pro';
import { IMaskMixin } from 'react-imask';

export const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
    <CFormInput {...props} ref={inputRef} />
));
