import PropTypes from 'prop-types';
import React from 'react';
import { CCallout, CLink } from '@coreui/react-pro';

const DocsCallout = (props) => {
    const { children, href, name } = props;

    const plural = name.slice(-1) === 's' ? true : false;

    const _href = `https://coreui.io/react/docs/${href}`;

    return (
        <CCallout color="info" className="bg-white dark:bg-dark">
            {children
                ? children
                : `A React ${name} component ${plural ? 'have' : 'has'} been created as a native React.js version
      of Bootstrap ${name}. ${name} ${plural ? 'are' : 'is'} delivered with some new features,
      variants, and unique design that matches CoreUI Design System requirements.`}
            <br />
            <br />
            For more information please visit our official{' '}
            <CLink href={_href} target="_blank">
                documentation of CoreUI Components Library for React.js
            </CLink>
            .
        </CCallout>
    );
};

DocsCallout.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
    name: PropTypes.string,
};

export default React.memo(DocsCallout);
