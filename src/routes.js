import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Students = React.lazy(() => import('./views/students/StudentsPage'));
const PaymentMethods = React.lazy(() =>
    import('./views/system-config/cashbook/payment-methods/PaymentMethodsPage'),
);
const AssetTypes = React.lazy(() =>
    import('./views/system-config/cashbook/asset-types/AssetTypesPage'),
);
const EquityTypes = React.lazy(() =>
    import('./views/system-config/cashbook/equity-types/EquityTypesPage'),
);
const ExpenseTypes = React.lazy(() =>
    import('./views/system-config/cashbook/expense-types/ExpenseTypesPage'),
);
const IncomeTypes = React.lazy(() =>
    import('./views/system-config/cashbook/income-types/IncomeTypesPage'),
);
const LiabilityTypes = React.lazy(() =>
    import('./views/system-config/cashbook/liability-types/LiabilityTypesPage'),
);
const AssessmentTypes = React.lazy(() =>
    import('./views/system-config/sis/assessment-types/AssessmentTypesPage'),
);
const ExamBoards = React.lazy(() => import('./views/system-config/sis/exam-boards/ExamBoardsPage'));
const Grades = React.lazy(() => import('./views/system-config/sis/grades/GradesPage'));
const LessonRates = React.lazy(() =>
    import('./views/system-config/sis/lesson-rates/LessonRatesPage'),
);
const SessionTypes = React.lazy(() =>
    import('./views/system-config/sis/session-types/SessionTypesPage'),
);
const Subjects = React.lazy(() => import('./views/system-config/sis/subjects/SubjectsPage'));
const Users = React.lazy(() => import('./views/system-config/users/UsersPage'));

const Colors = React.lazy(() => import('./views/theme/colors/Colors'));

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/theme', name: 'Theme', element: Colors, exact: true },
    { path: '/students', name: 'Students', element: Students, exact: true },
    { path: '/students/enrolment', name: 'Enrolment', element: Students, exact: true },
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
];

export default routes;
