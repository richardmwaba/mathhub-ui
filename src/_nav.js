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
];

export default _nav;
