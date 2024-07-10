import React from 'react';
import { CRow } from '@coreui/react-pro';
import PropTypes from 'prop-types';

const StudentPersonalInfo = ({ student }) => {
    return (
        <CRow>
            <h2>{student.name}</h2>
        </CRow>
    );
};

StudentPersonalInfo.propTypes = {
    student: PropTypes.object.isRequired,
};

export default StudentPersonalInfo;
