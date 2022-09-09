/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import HeaderToolBar from '../components/HeaderToolBar';
import LeftSideToolBar from '../components/LeftSideToolBar';
import IEstabelecimento from '../interfaces/IEstabelecimento';
import api from '../services/api';

import './Estabelecimentos.css';
import { TiTrash } from 'react-icons/ti';
import { Modal } from 'react-bootstrap';
import { Distinct } from '../Helper/helper';
import IEntidadeGenerica from '../interfaces/IEntidadeGenerica';
import NovoEstabelecimento from '../components/NovoEstabelecimento/NovoEstabelecimento';
import Master from './Master';

export interface IGrupoClassificacao extends IEntidadeGenerica {
	estabelecimentos: IEstabelecimento[];
}

export default function Estabelecimentos() {
	const queryClient = useQueryClient();

	// Queries
	const { data: estabs, isFetching: loadingState } = useQuery(
		['estabelecimentos'],
		async () => {
			const { data } = await api.get<IEstabelecimento[]>(`estabelecimento?exibicao=${exibicao}`);

			const groups = Distinct(data.map(x => x.classificacao));
			const estabs: IGrupoClassificacao[] = [];

			groups.forEach(gr => {
				estabs.push({
					id: gr.id,
					descricao: gr.descricao,
					estabelecimentos: data
						.filter(({ classificacao }) => classificacao.id === gr.id)
						.sort((a, b) => (a.lancamentosTotal > b.lancamentosTotal ? -1 : 1)),
				});
			});

			return estabs;
		},
		{
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60,
		}
	);

	//const [estabs, setEstabs] = useState<IGrupoClassificacao[]>([]);
	const [showDeleteDialog, setShowDeleteDialog] = useState({
		show: false,
		item: { id: 0, idGr: 0 },
	});
	const [exibicao, setExibicao] = useState(1);
	//const [loadingState, setLoadingState] = useState(true);
	const [showNewDialog, setShowNewDialog] = useState(false);

	// useEffect(() => {
	// 	setLoadingState(true);

	// 	api.get<IEstabelecimento[]>(`estabelecimento?exibicao=${exibicao}`).then(({ data }) => {
	// 		const groups = Distinct(data.map(x => x.classificacao));
	// 		const estabs: IGrupoClassificacao[] = [];

	// 		groups.forEach(gr => {
	// 			estabs.push({
	// 				id: gr.id,
	// 				descricao: gr.descricao,
	// 				estabelecimentos: data
	// 					.filter(({ classificacao }) => classificacao.id === gr.id)
	// 					.sort((a, b) => (a.lancamentosTotal > b.lancamentosTotal ? -1 : 1)),
	// 			});
	// 		});

	// 		setEstabs(estabs);
	// 		setLoadingState(false);
	// 	});
	// }, [exibicao]);

	function handleDelete() {
		const { id, idGr } = showDeleteDialog.item;

		api.delete(`estabelecimento/${id}`).then(result => {
			//alert('deu certo');
		});

		if (estabs) {
			const indexGr = estabs.findIndex(x => Number(x.id) === idGr);
			estabs[indexGr].estabelecimentos = estabs[indexGr].estabelecimentos.filter(x => Number(x.id) !== id);
		}
		//setEstabs([...estabs]);

		setShowDeleteDialog({ show: false, item: { id: 0, idGr: 0 } });
	}

	function handleVisualization() {
		setExibicao(i => (i === 1 ? 0 : 1));
		queryClient.invalidateQueries(['estabelecimentos']);
		console.log('teste');
	}

	function modalDelete() {
		return (
			<Modal
				show={showDeleteDialog.show}
				onHide={() =>
					setShowDeleteDialog({
						show: false,
						item: { id: 0, idGr: 0 },
					})
				}
			>
				<Modal.Header closeButton>
					<Modal.Title>Excluir Estabelecimento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Confirma exclusão do registro {showDeleteDialog.item.id}?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant='secondary'
						onClick={() =>
							setShowDeleteDialog({
								show: false,
								item: { id: 0, idGr: 0 },
							})
						}
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
		<Master title='Estabelecimentos'>
			<div className='estabelecimentos'>
				{modalDelete()}
				<NovoEstabelecimento show={showNewDialog} onClose={() => setShowNewDialog(false)} />
				<div className='application-header'>
					<HeaderToolBar
						title={{
							text: 'Estabelecimentos',
							url: '/estabelecimentos',
						}}
						links={[{ text: 'Novo', url: '', onClick: () => setShowNewDialog(true) }]}
					/>
				</div>
				{loadingState ? (
					<div className='loadingState'>
						<Spinner animation='grow' variant='dark' />
					</div>
				) : (
					<div className='application-body'>
						<div className='options'>
							<label>Exibir:</label>
							<Form.Check inline label='Todos' name='exibir' type='radio' checked={exibicao === 0} onChange={handleVisualization} />
							<Form.Check
								inline
								label='Com lançamentos'
								name='exibir'
								type='radio'
								checked={exibicao === 1}
								onChange={handleVisualization}
							/>
						</div>
						{estabs?.map(gr => {
							return (
								<fieldset>
									<legend>{gr.descricao}</legend>
									{gr.estabelecimentos.map(e => (
										<Card key={e.id}>
											<Card.Body>
												<Card.Title as='h6'>{e.palavraChave}</Card.Title>
												{e.descricao?.length > 0 && <Card.Text>{e.descricao}</Card.Text>}
												{e.lancamentosTotal > 0 && (
													<div className='total' title='Total de Lançamentos'>
														{e.lancamentosTotal} lançamento(s)
													</div>
												)}
												{e.descricoesExtrasTotal > 0 && (
													<div className='total' title='Descrição Extra'>
														{e.descricoesExtrasTotal} reclassificado(s)
													</div>
												)}
											</Card.Body>
											<Card.Footer>
												<Link to={`/editarestabelecimento/${e.id}`}>
													<BsPencilSquare size={20} color='rgb(54, 96, 146)' />
												</Link>
												<TiTrash
													size={25}
													onClick={() =>
														setShowDeleteDialog({
															show: true,
															item: {
																id: Number(e.id),
																idGr: Number(gr.id),
															},
														})
													}
													color='rgb(130, 11, 17)'
												/>
											</Card.Footer>
										</Card>
									))}
								</fieldset>
							);
						})}
					</div>
				)}
			</div>
		</Master>
	);
}
