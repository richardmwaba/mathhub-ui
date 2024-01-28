import React from 'react';
import CIcon from '@coreui/icons-react';
import {
    cilBell,
    cilBook,
    cilCalculator,
    cilCalendar,
    cilChartPie,
    cilCursor,
    cilDrop,
    cilEnvelopeOpen,
    cilGrid,
    cilLayers,
    cilMap,
    cilMoney,
    cilNotes,
    cilPencil,
    cilPeople,
    cilPuzzle,
    cilSchool,
    cilSpeedometer,
    cilSpreadsheet,
    cilStar,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro';

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
            color: 'info-gradient',
        },
    },
    {
        component: CNavTitle,
        name: 'Students',
    },
    {
        component: CNavItem,
        name: 'Enrolment',
        to: '/students/enrolment',
        icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Typography',
        to: '/theme/typography',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Cash Book',
    },
    {
        component: CNavTitle,
        name: 'Configuration',
    },
    {
        component: CNavGroup,
        name: 'Cash Book',
        to: '/system-config/payment-methods',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Asset Types',
                to: '/system-config/asset-types',
            },
            {
                component: CNavItem,
                name: 'Equity Types',
                to: '/system-config/equity-types',
            },
            {
                component: CNavItem,
                name: 'Expense Types',
                to: '/system-config/expense-types',
            },
            {
                component: CNavItem,
                name: 'Income Types',
                to: '/system-config/income-types',
            },
            {
                component: CNavItem,
                name: 'Liability Types',
                to: '/system-config/liability-types',
            },
            {
                component: CNavItem,
                name: 'Payment Methods',
                to: '/system-config/payment-methods',
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Students Center',
        to: '/system-config/assessment-types',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Assessment Types',
                to: '/system-config/assessment-types',
            },
            {
                component: CNavItem,
                name: 'Exam Boards',
                to: '/system-config/exam-boards',
            },
            {
                component: CNavItem,
                name: 'Grades',
                to: '/system-config/grades',
            },
            {
                component: CNavItem,
                name: 'Lesson Rates',
                to: '/system-config/lesson-rates',
            },
            {
                component: CNavItem,
                name: 'Session Types',
                to: '/system-config/session-types',
            },
            {
                component: CNavItem,
                name: 'Subjects',
                to: '/system-config/subjects',
            },
        ],
    },
    {
        component: CNavItem,
        name: 'Users',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
        to: '/system-config/users',
    },
    {
        component: CNavTitle,
        name: 'Components',
    },
    {
        component: CNavGroup,
        name: 'Base',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Accordion',
                to: '/base/accordion',
            },
            {
                component: CNavItem,
                name: 'Breadcrumb',
                to: '/base/breadcrumbs',
            },
            {
                component: CNavItem,
                name: 'Cards',
                to: '/base/cards',
            },
            {
                component: CNavItem,
                name: 'Carousel',
                to: '/base/carousels',
            },
            {
                component: CNavItem,
                name: 'Collapse',
                to: '/base/collapses',
            },
            {
                component: CNavItem,
                name: 'List group',
                to: '/base/list-groups',
            },
            {
                component: CNavItem,
                name: 'Navs & Tabs',
                to: '/base/navs',
            },
            {
                component: CNavItem,
                name: 'Pagination',
                to: '/base/paginations',
            },
            {
                component: CNavItem,
                name: 'Placeholders',
                to: '/base/placeholders',
            },
            {
                component: CNavItem,
                name: 'Popovers',
                to: '/base/popovers',
            },
            {
                component: CNavItem,
                name: 'Progress',
                to: '/base/progress',
            },
            {
                component: CNavItem,
                name: 'Spinners',
                to: '/base/spinners',
            },
            {
                component: CNavItem,
                name: 'Tables',
                to: '/base/tables',
            },
            {
                component: CNavItem,
                name: 'Tooltips',
                to: '/base/tooltips',
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Buttons',
                to: '/buttons/buttons',
            },
            {
                component: CNavItem,
                name: 'Buttons groups',
                to: '/buttons/button-groups',
            },
            {
                component: CNavItem,
                name: 'Dropdowns',
                to: '/buttons/dropdowns',
            },
            {
                component: CNavItem,
                name: 'Loading Buttons',
                to: '/buttons/loading-buttons',
                badge: {
                    color: 'danger-gradient',
                    text: 'PRO',
                },
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Forms',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Form Control',
                to: '/forms/form-control',
            },
            {
                component: CNavItem,
                name: 'Select',
                to: '/forms/select',
            },
            {
                component: CNavItem,
                name: 'Multi Select',
                to: '/forms/multi-select',
                badge: {
                    color: 'danger-gradient',
                    text: 'PRO',
                },
            },
            {
                component: CNavItem,
                name: 'Checks & Radios',
                to: '/forms/checks-radios',
            },
            {
                component: CNavItem,
                name: 'Range',
                to: '/forms/range',
            },
            {
                component: CNavItem,
                name: 'Input Group',
                to: '/forms/input-group',
            },
            {
                component: CNavItem,
                name: 'Floating Labels',
                to: '/forms/floating-labels',
            },
            {
                component: CNavItem,
                name: 'Date Picker',
                to: '/forms/date-picker',
                badge: {
                    color: 'danger-gradient',
                    text: 'PRO',
                },
            },
            {
                component: CNavItem,
                name: 'Date Range Picker',
                to: '/forms/date-range-picker',
                badge: {
                    color: 'danger-gradient',
                    text: 'PRO',
                },
            },
            {
                component: CNavItem,
                name: 'Time Picker',
                to: '/forms/time-picker',
                badge: {
                    color: 'danger-gradient',
                    text: 'PRO',
                },
            },
            {
                component: CNavItem,
                name: 'Layout',
                to: '/forms/layout',
            },
            {
                component: CNavItem,
                name: 'Validation',
                to: '/forms/validation',
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Icons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'CoreUI Free',
                to: '/icons/coreui-icons',
                badge: {
                    color: 'success-gradient',
                    text: 'FREE',
                },
            },
            {
                component: CNavItem,
                name: 'CoreUI Flags',
                to: '/icons/flags',
            },
            {
                component: CNavItem,
                name: 'CoreUI Brands',
                to: '/icons/brands',
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Alerts',
                to: '/notifications/alerts',
            },
            {
                component: CNavItem,
                name: 'Badges',
                to: '/notifications/badges',
            },
            {
                component: CNavItem,
                name: 'Modal',
                to: '/notifications/modals',
            },
            {
                component: CNavItem,
                name: 'Toasts',
                to: '/notifications/toasts',
            },
        ],
    },
    {
        component: CNavItem,
        name: 'Widgets',
        to: '/widgets',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        badge: {
            color: 'info-gradient',
            text: 'NEW',
        },
    },
    {
        component: CNavItem,
        name: 'Smart Table',
        icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
        badge: {
            color: 'danger-gradient',
            text: 'PRO',
        },
        to: '/smart-table',
    },
    {
        component: CNavTitle,
        name: 'Plugins',
    },
    {
        component: CNavItem,
        name: 'Calendar',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
        badge: {
            color: 'danger-gradient',
            text: 'PRO',
        },
        to: '/plugins/calendar',
    },
    {
        component: CNavItem,
        name: 'Charts',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        to: '/plugins/charts',
    },
    {
        component: CNavItem,
        name: 'Google Maps',
        icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
        badge: {
            color: 'danger-gradient',
            text: 'PRO',
        },
        to: '/plugins/google-maps',
    },
    {
        component: CNavTitle,
        name: 'Extras',
    },
    // {
    //     component: CNavGroup,
    //     name: 'Pages',
    //     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    //     items: [
    //         {
    //             component: CNavItem,
    //             name: 'Login',
    //             to: '/login',
    //         },
    //         {
    //             component: CNavItem,
    //             name: 'Register',
    //             to: '/register',
    //         },
    //         {
    //             component: CNavItem,
    //             name: 'Error 404',
    //             to: '/404',
    //         },
    //         {
    //             component: CNavItem,
    //             name: 'Error 500',
    //             to: '/500',
    //         },
    //     ],
    // },
    {
        component: CNavGroup,
        name: 'Apps',
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
        items: [
            {
                component: CNavGroup,
                name: 'Invoicing',
                icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
                to: '/apps/invoicing',
                items: [
                    {
                        component: CNavItem,
                        name: 'Invoice',
                        badge: {
                            color: 'danger-gradient',
                            text: 'PRO',
                        },
                        to: '/apps/invoicing/invoice',
                    },
                ],
            },
            {
                component: CNavGroup,
                name: 'Email',
                to: '/apps/email',
                icon: <CIcon icon={cilEnvelopeOpen} customClassName="nav-icon" />,
                items: [
                    {
                        component: CNavItem,
                        name: 'Inbox',
                        badge: {
                            color: 'danger-gradient',
                            text: 'PRO',
                        },
                        to: '/apps/email/inbox',
                    },
                    {
                        component: CNavItem,
                        name: 'Message',
                        badge: {
                            color: 'danger-gradient',
                            text: 'PRO',
                        },
                        to: '/apps/email/message',
                    },
                    {
                        component: CNavItem,
                        name: 'Compose',
                        badge: {
                            color: 'danger-gradient',
                            text: 'PRO',
                        },
                        to: '/apps/email/compose',
                    },
                ],
            },
        ],
    },
];

export default _nav;
