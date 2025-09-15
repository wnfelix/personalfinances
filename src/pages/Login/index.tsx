import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    token: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Set authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            // Navigate to LancamentoUpload page
            navigate('/lancamentos');
        },
        onError: (error: any) => {
            setShowError(true);
            setErrorMessage(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowError(false);

        if (!email || !password) {
            setShowError(true);
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100">
                <Col xs={12} md={6} lg={4} className="mx-auto">
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4>Login</h4>
                            <small>Minhas Finanças Pessoais</small>
                        </Card.Header>
                        <Card.Body>
                            {showError && (
                                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                    {errorMessage}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Digite seu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100"
                                    disabled={loginMutation.isLoading}
                                >
                                    {loginMutation.isLoading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;