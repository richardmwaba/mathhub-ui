import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Students = React.lazy(() => import('./views/students/StudentsPage'));
const CashbookSummary = React.lazy(() => import('./views/cashbook/summary/CashbookSummaryPage'));
const Assets = React.lazy(() => import('./views/cashbook/business-assets/AssetsPage'));
const Expenses = React.lazy(() => import('./views/cashbook/expenses/ExpensesPage'));
const Incomes = React.lazy(() => import('./views/cashbook/incomes/IncomesPage'));
const Liabilities = React.lazy(() => import('./views/cashbook/liabilities/LiabilitiesPage'));
const Equities = React.lazy(() => import('./views/cashbook/equity/EquitiesPage'));
const PaymentMethods = React.lazy(
    () => import('./views/system-config/cashbook/payment-methods/PaymentMethodsPage'),
);
const AssetTypes = React.lazy(
    () => import('./views/system-config/cashbook/asset-types/AssetTypesPage'),
);
const EquityTypes = React.lazy(
    () => import('./views/system-config/cashbook/equity-types/EquityTypesPage'),
);
const ExpenseTypes = React.lazy(
    () => import('./views/system-config/cashbook/expense-types/ExpenseTypesPage'),
);
const IncomeTypes = React.lazy(
    () => import('./views/system-config/cashbook/income-types/IncomeTypesPage'),
);
const LiabilityTypes = React.lazy(
    () => import('./views/system-config/cashbook/liability-types/LiabilityTypesPage'),
);
const AssessmentTypes = React.lazy(
    () => import('./views/system-config/sis/assessment-types/AssessmentTypesPage'),
);
const ExamBoards = React.lazy(() => import('./views/system-config/sis/exam-boards/ExamBoardsPage'));
const Grades = React.lazy(() => import('./views/system-config/sis/grades/GradesPage'));
const LessonRates = React.lazy(
    () => import('./views/system-config/sis/lesson-rates/LessonRatesPage'),
);
const SessionTypes = React.lazy(
    () => import('./views/system-config/sis/session-types/SessionTypesPage'),
);
const Subjects = React.lazy(() => import('./views/system-config/sis/subjects/SubjectsPage'));
const Users = React.lazy(() => import('./views/system-config/users/UsersPage'));

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));

// Plugins
const Charts = React.lazy(() => import('./views/plugins/charts/Charts'));

const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

const Invoice = React.lazy(() => import('./views/apps/invoicing/Invoice'));

const routes = [
    { path: '/', exact: true, name: 'Home' },
    {
        path: '/dashboard',
        name: 'Dashboard',
        element: Dashboard,
    },
    { path: '/students', name: 'Students', element: Students, exact: true },
    { path: '/students/enrolment', name: 'Enrolment', element: Students, exact: true },
    { path: '/cashbook', name: 'Cashbook', element: CashbookSummary, exact: true },
    { path: '/cashbook/assets', name: 'Assets', element: Assets, exact: true },
    { path: '/cashbook/equities', name: 'Equities', element: Equities, exact: true },
    { path: '/cashbook/expenses', name: 'Expenses', element: Expenses, exact: true },
    { path: '/cashbook/incomes', name: 'Incomes', element: Incomes, exact: true },
    { path: '/cashbook/liabilities', name: 'Liabilities', element: Liabilities, exact: true },
    { path: '/system-config', name: 'Configuration', element: PaymentMethods, exact: true },
    {
        path: '/system-config/payment-methods',
        name: 'Payment Methods',
        element: PaymentMethods,
        exact: true,
    },
    {
        path: '/system-config/asset-types',
        name: 'Asset Types',
        element: AssetTypes,
        exact: true,
    },
    {
        path: '/system-config/equity-types',
        name: 'Equity Types',
        element: EquityTypes,
        exact: true,
    },
    {
        path: '/system-config/expense-types',
        name: 'Exepense Types',
        element: ExpenseTypes,
        exact: true,
    },
    {
        path: '/system-config/income-types',
        name: 'Income Types',
        element: IncomeTypes,
        exact: true,
    },
    {
        path: '/system-config/liability-types',
        name: 'Liability Types',
        element: LiabilityTypes,
        exact: true,
    },
    {
        path: '/system-config/assessment-types',
        name: 'Assessment Types',
        element: AssessmentTypes,
        exact: true,
    },
    {
        path: '/system-config/exam-boards',
        name: 'Exam Boards',
        element: ExamBoards,
        exact: true,
    },
    {
        path: '/system-config/grades',
        name: 'Grades',
        element: Grades,
        exact: true,
    },
    {
        path: '/system-config/lesson-rates',
        name: 'Lesson Rates',
        element: LessonRates,
        exact: true,
    },
    {
        path: '/system-config/session-types',
        name: 'Session Types',
        element: SessionTypes,
        exact: true,
    },
    {
        path: '/system-config/subjects',
        name: 'Subjects',
        element: Subjects,
        exact: true,
    },
    {
        path: '/system-config/users',
        name: 'Users',
        element: Users,
        exact: true,
    },
    {
        path: '/notifications',
        name: 'Notifications',
        element: Alerts,
        exact: true,
    },
    { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
    { path: '/notifications/badges', name: 'Badges', element: Badges },
    {
        path: '/plugins/charts',
        name: 'Charts',
        element: Charts,
    },
    { path: '/widgets', name: 'Widgets', element: Widgets },
    {
        path: '/apps',
        name: 'Apps',
        element: Invoice,
        exact: true,
    },
    { path: '/apps/invoicing', name: 'Invoice', element: Invoice, exact: true },
    { path: '/apps/invoicing/invoice', name: 'Invoice', element: Invoice },
    { path: '/apps/email', name: 'Email', exact: true },
    { path: '/apps/email/inbox', name: 'Inbox', exact: true },
    { path: '/apps/email/compose', name: 'Compose', exact: true },
    { path: '/apps/email/message', name: 'Message', exact: true },
];

export default routes;
