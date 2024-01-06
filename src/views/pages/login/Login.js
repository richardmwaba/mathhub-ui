import { React, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CButton,
    CLoadingButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { logoSecondary } from 'src/assets/brand/mathhub-logo-vertical';
import { cilLockLocked, cilUser } from '@coreui/icons';
import AuthService from 'src/services/auth.service';
import useAuthentication from 'src/hooks/useAuth';

export default function Login() {
    const { setCurrentUser } = useAuthentication();
    const usernameRef = useRef();
    const errorRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setLoading(true);

            await AuthService.login(username, password).then(
                (response) => {
                    const accessToken = response.accessToken;
                    const userRoles = response.roles;
                    setCurrentUser({ username, accessToken, userRoles });
                    setUsername('');
                    setPassword('');
                    navigate(from, { replace: true });
                },
                (error) => {
                    if (!error?.response) {
                        setErrorMessage('No server response');
                    }

                    if (error.response?.status === 401) {
                        setErrorMessage('Incorrect username or password!');
                    } else {
                        setErrorMessage('Login failed. Server may be unavailable!');
                    }

                    errorRef.current?.focus();
                    setLoading(false);
                },
            );
        }

        setValidated(true);
    };

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [username, password]);

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={validated}
                                        onSubmit={handleLogin}
                                    >
                                        <h1>Login</h1>
                                        <p className="text-medium-emphasis">
                                            Sign In to your account
                                        </p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                autoComplete="username"
                                                id="username"
                                                name="username"
                                                onChange={onChangeUsername}
                                                placeholder="Username"
                                                required
                                                ref={usernameRef}
                                                value={username}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                required
                                                name="password"
                                                value={password}
                                                onChange={onChangePassword}
                                            />
                                        </CInputGroup>
                                        {errorMessage && (
                                            <p
                                                ref={errorRef}
                                                style={{ color: 'red' }}
                                                aria-live="assertive"
                                            >
                                                {errorMessage}
                                            </p>
                                        )}
                                        <CRow>
                                            <CCol xs={6}>
                                                <CLoadingButton
                                                    color="primary"
                                                    className="px-4"
                                                    loading={loading}
                                                    type="submit"
                                                >
                                                    Login
                                                </CLoadingButton>
                                            </CCol>
                                            <CCol xs={6} className="text-right">
                                                <CButton color="link" className="px-0">
                                                    Forgot password?
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                            <CCard className="text-white bg-primary">
                                <CCardBody className="text-center" style={{ alignItems: 'center' }}>
                                    <div style={{ marginLeft: '70px' }}>
                                        <CIcon icon={logoSecondary} width={260} height={210} />
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
}
