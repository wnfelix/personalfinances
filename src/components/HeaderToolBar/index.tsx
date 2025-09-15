import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface IHeaderToolBarProps {
	title: {
		text: string;
		url: string;
	};
	links: { text: string; url: string; onClick?: () => void; title?: string }[];
}

export default function HeaderToolBar(props: IHeaderToolBarProps) {
	const { user, logout } = useAuth();

	return (
		<Navbar bg='primary' variant='dark'>
			<Nav className='mr-auto'>
				{props.links.map(l =>
					l.onClick ? (
						<Nav.Link key={l.text} as={Button} to={l.url} onClick={l.onClick} title={l.title ?? ''}>
							{l.text}
						</Nav.Link>
					) : (
						<Nav.Link key={l.text} as={Link} to={l.url} title={l.title ?? ''}>
							{l.text}
						</Nav.Link>
					)
				)}
			</Nav>
			<Nav className='ml-auto'>
				{user && (
					<>
						<Navbar.Text className='mr-3'>
							Olá, {user.firstName}
						</Navbar.Text>
						<Button variant='outline-light' size='sm' onClick={logout}>
							Sair
						</Button>
					</>
				)}
			</Nav>
		</Navbar>
	);
}
