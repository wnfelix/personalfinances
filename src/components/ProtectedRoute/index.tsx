import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<Container
				fluid
				className='d-flex align-items-center justify-content-center min-vh-100'
			>
				<Row>
					<Col className='text-center'>
						<Spinner animation='border' role='status'>
							<span className='visually-hidden'>
								Carregando...
							</span>
						</Spinner>
						<div className='mt-3'>
							<p>Verificando autenticação...</p>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}

	if (!isAuthenticated) {
		// Redirect to login page with return url
		return <Navigate to='/' state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
