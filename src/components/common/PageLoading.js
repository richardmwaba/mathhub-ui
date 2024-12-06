import { CSpinner } from '@coreui/react-pro';
import React from 'react';

export function PageLoading() {
    return (
        <div className="d-flex justify-content-center">
            <CSpinner variant="grow" />
        </div>
    );
}
