import React from 'react';
import {
    CBadge,
    CDropdown,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CProgress,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilBasket, cilBell, cilChartPie, cilSpeedometer, cilUserFollow, cilUserUnfollow } from '@coreui/icons';

const AppHeaderDropdownNotif = () => {
    const itemsCount = 5;
    return (
        <CDropdown variant="nav-item" alignment="end">
            <CDropdownToggle caret={false}>
                <span className="d-inline-block my-1 mx-2 position-relative">
                    <CIcon icon={cilBell} size="lg" />
                    <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
                        <span className="visually-hidden">{itemsCount} new alerts</span>
                    </CBadge>
                </span>
            </CDropdownToggle>
            <CDropdownMenu className="py-0">
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
                    notificationsCounter
                </CDropdownHeader>
                <CDropdownItem>
                    <CIcon icon={cilUserFollow} className="me-2 text-success" /> newUserRegistered
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilUserUnfollow} className="me-2 text-danger" /> userDeleted
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilChartPie} className="me-2 text-info" /> salesReportIsReady
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilBasket} className="me-2 text-primary" /> newClient
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilSpeedometer} className="me-2 text-warning" /> serverOverloaded
                </CDropdownItem>
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold my-2">
                    server
                </CDropdownHeader>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">cpuUsage</div>
                    <CProgress thin color="info-gradient" value={25} />
                    <div className="text-body-secondary small">cpuUsageDescription</div>
                </CDropdownItem>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">memoryUsage</div>
                    <CProgress thin color="warning-gradient" value={70} />
                    <div className="text-body-secondary small">11444GB/16384MB</div>
                </CDropdownItem>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">ssdUsage</div>
                    <CProgress thin color="danger-gradient" value={90} />
                    <div className="text-body-secondary small">243GB/256GB</div>
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    );
};

export default AppHeaderDropdownNotif;
