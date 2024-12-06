import React from 'react';
import {
    CAvatar,
    CBadge,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react-pro';
import {
    cilBell,
    cilCreditCard,
    cilCommentSquare,
    cilEnvelopeOpen,
    cilFile,
    cilLockLocked,
    cilSettings,
    cilTask,
    cilUser,
    cilAccountLogout,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import useAuthentication from 'src/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from 'src/api/auth/auth.service';

import avatar8 from './../../assets/images/avatars/8.jpg';

const AppHeaderDropdown = () => {
    const { authentication, setAuthentication } = useAuthentication();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async (event) => {
        event.preventDefault();
        await AuthService.logout(authentication?.username).then((response) => {
            if (response?.status === 204) {
                localStorage.removeItem('refresh_token');
                navigate('/login', { state: { from: location }, replace: true });
                setAuthentication({});
            }
        });
    };

    return (
        <CDropdown variant="nav-item" alignment="end">
            <CDropdownToggle className="py-0" caret={false}>
                <CAvatar src={avatar8} size="md" status="success" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
                    {'account'}
                </CDropdownHeader>
                <CDropdownItem href="#">
                    <CIcon icon={cilBell} className="me-2" />
                    {'updates'}
                    <CBadge color="info-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilEnvelopeOpen} className="me-2" />
                    {'messages'}
                    <CBadge color="success-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilTask} className="me-2" />
                    {'tasks'}
                    <CBadge color="danger-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilCommentSquare} className="me-2" />
                    {'comments'}
                    <CBadge color="warning-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold my-2">
                    {'settings'}
                </CDropdownHeader>
                <CDropdownItem href="#">
                    <CIcon icon={cilUser} className="me-2" />
                    {'profile'}
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilSettings} className="me-2" />
                    {'settings'}
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilCreditCard} className="me-2" />
                    {'payments'}
                    <CBadge color="secondary-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilFile} className="me-2" />
                    {'projects'}
                    <CBadge color="primary-gradient" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem href="#">
                    <CIcon icon={cilLockLocked} className="me-2" />
                    {'lockAccount'}
                </CDropdownItem>
                <CDropdownItem href="#" onClick={handleLogout}>
                    <CIcon icon={cilAccountLogout} className="me-2" />
                    {'logout'}
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    );
};

export default AppHeaderDropdown;
