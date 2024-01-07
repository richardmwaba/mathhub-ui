import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import {
    CContainer,
    CForm,
    CFormInput,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CHeaderToggler,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilApplicationsSettings, cilMenu, cilSearch } from '@coreui/icons';

import {
    AppHeaderDropdown,
    AppHeaderDropdownMssg,
    AppHeaderDropdownNotif,
    AppHeaderDropdownTasks,
} from './header/index';

import { logoMain } from 'src/assets/brand/mathhub-logo';

const AppHeader = () => {
    const dispatch = useDispatch();

    const theme = useSelector((state) => state.theme);

    theme === 'dark'
        ? document.body.classList.add('dark-theme')
        : document.body.classList.remove('dark-theme');

    const sidebarShow = useSelector((state) => state.sidebarShow);
    const asideShow = useSelector((state) => state.asideShow);

    return (
        <CHeader position="sticky" className="bg-primary mb-4">
            <CContainer fluid>
                <CHeaderToggler
                    className={classNames('px-md-0 me-md-3 d-lg-none', {
                        'prevent-hide': !sidebarShow,
                    })}
                    onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                >
                    <CIcon icon={cilMenu} size="lg" />
                </CHeaderToggler>
                <CHeaderBrand className="mx-auto d-md-none text-white" to="/">
                    <CIcon icon={logoMain} height={34} alt="Logo" />
                </CHeaderBrand>
                <CForm className="d-none d-md-flex">
                    <CInputGroup>
                        <CInputGroupText id="search-addon" className="bg-light border-0 px-1">
                            <CIcon icon={cilSearch} size="lg" className="my-1 mx-2 text-disabled" />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="search-addon"
                            className="bg-light border-0"
                        />
                    </CInputGroup>
                </CForm>
                <CHeaderNav className="d-none d-sm-flex ms-auto me-3">
                    <AppHeaderDropdownNotif />
                    <AppHeaderDropdownTasks />
                    <AppHeaderDropdownMssg />
                </CHeaderNav>
                <CHeaderNav className="ms-auto ms-sm-0 me-sm-4">
                    <AppHeaderDropdown />
                </CHeaderNav>
                <CHeaderToggler
                    className="px-md-0 me-md-3"
                    onClick={() => dispatch({ type: 'set', asideShow: !asideShow })}
                >
                    <CIcon icon={cilApplicationsSettings} size="lg" />
                </CHeaderToggler>
            </CContainer>
        </CHeader>
    );
};

export default AppHeader;
