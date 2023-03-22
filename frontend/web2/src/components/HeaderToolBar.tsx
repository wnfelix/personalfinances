import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface IHeaderToolBarProps {
	title: {
		text: string;
		url: string;
	};
	links: { text: string; url: string; onClick?: () => void; title?: string }[];
}

export default function HeaderToolBar(props: IHeaderToolBarProps) {
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
		</Navbar>
	);
}
