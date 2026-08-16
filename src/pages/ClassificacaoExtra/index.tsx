import React, { useState } from 'react';
import { Badge, Button, Modal, Spinner, Table } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { TiTrash } from 'react-icons/ti';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import HeaderToolBar from '../../components/HeaderToolBar';
import ClassificacaoExtraForm from '../../components/ClassificacaoExtra';
import IClassificacaoExtra from '../../interfaces/IClassificacaoExtra';
import api from '../../services/api';
import Master from '../Master';
import './styles.css';

export default function ClassificacaoExtra() {
	const queryClient = useQueryClient();
	const [showFormDialog, setShowFormDialog] = useState<{
		show: boolean;
		item?: IClassificacaoExtra;
	}>({ show: false });
	const [showDeleteDialog, setShowDeleteDialog] = useState<{
		show: boolean;
		item?: IClassificacaoExtra;
	}>({ show: false });

	const { data: classificacoes, isFetching: loadingState } = useQuery(
		['classificacaoextra'],
		async () => {
			const { data } = await api.get<IClassificacaoExtra[]>('extra-category');
			return data;
		},
		{ refetchOnWindowFocus: false, staleTime: 1000 * 60 }
	);

	function handleCloseForm() {
		setShowFormDialog({ show: false });
	}

	async function handleDelete() {
		if (!showDeleteDialog.item) return;

		try {
			await api.delete(`extra-category/${showDeleteDialog.item.id}`);
			queryClient.invalidateQueries(['classificacaoextra']);
		} catch (error) {
			alert('Ocorreu um problema ao excluir, tente novamente');
		} finally {
			setShowDeleteDialog({ show: false });
		}
	}

	function modalDelete() {
		return (
			<Modal
				show={showDeleteDialog.show}
				onHide={() => setShowDeleteDialog({ show: false })}
			>
				<Modal.Header closeButton>
					<Modal.Title>Excluir Classificação Extra</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Confirma exclusão de "{showDeleteDialog.item?.name}"?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant='secondary'
						onClick={() => setShowDeleteDialog({ show: false })}
					>
						Cancelar
					</Button>
					<Button variant='primary' onClick={() => handleDelete()}>
						Excluir
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	return (
		<Master title='Classificação Extra'>
			<div className='classificacaoextra'>
				{modalDelete()}
				<ClassificacaoExtraForm
					show={showFormDialog.show}
					item={showFormDialog.item}
					onClose={handleCloseForm}
				/>
				<div className='application-header'>
					<HeaderToolBar
						title={{ text: 'Classificação Extra', url: '/classificacaoextra' }}
						links={[
							{
								text: 'Novo',
								url: '',
								onClick: () =>
									setShowFormDialog({ show: true, item: undefined }),
							},
						]}
					/>
				</div>
				{loadingState ? (
					<div className='loadingState'>
						<Spinner animation='grow' variant='dark' />
					</div>
				) : (
					<div className='application-body'>
						<Table>
							<thead>
								<tr>
									<th>Nome</th>
									<th>Prefixo</th>
									<th>Categoria</th>
									<th>Data Início</th>
									<th>Data Fim</th>
									<th>Ativo</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{classificacoes
									?.sort((a, b) => (a.name > b.name ? 1 : -1))
									.map(c => (
										<tr key={c.id}>
											<td>{c.name}</td>
											<td>{c.prefix}</td>
											<td>{c.categoryName}</td>
											<td>
												{format(
													toZonedTime(c.startDate, 'UTC'),
													'dd/MM/yyyy'
												)}
											</td>
											<td>
												{format(
													toZonedTime(c.endDate, 'UTC'),
													'dd/MM/yyyy'
												)}
											</td>
											<td>
												<Badge
													variant={c.active ? 'success' : 'secondary'}
												>
													{c.active ? 'Ativo' : 'Inativo'}
												</Badge>
											</td>
											<td>
												<BsPencilSquare
													size={20}
													color='rgb(54, 96, 146)'
													onClick={() =>
														setShowFormDialog({
															show: true,
															item: c,
														})
													}
												/>
												<TiTrash
													size={25}
													color='rgb(130, 11, 17)'
													onClick={() =>
														setShowDeleteDialog({
															show: true,
															item: c,
														})
													}
												/>
											</td>
										</tr>
									))}
							</tbody>
						</Table>
					</div>
				)}
			</div>
		</Master>
	);
}
