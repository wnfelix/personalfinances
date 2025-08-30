import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import api from '../../services/api';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import IValueLabelPair from '../../interfaces/IValueLabelPair';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { IGrupoClassificacao } from '../../pages/Estabelecimentos';

interface INovoEstabelecimentoIni {
	show: boolean;
	id?: string;
	description?: string;
	onClose?: () => void;
	onLoading?: () => void;
	onLoaded?: () => void;
}

export default function NovoEstabelecimento(props: INovoEstabelecimentoIni) {
	const [description, setDescription] = useState('');
	const [chave, setChave] = useState(props.description ?? '');
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);
	const [tipo, setTipo] = useState<IValueLabelPair | null>();

	const queryClient = useQueryClient();
	//const [requestData, setRequestData] = useState<IRequestDetailsModal>({} as IRequestDetailsModal)

	useEffect(() => {
		setChave(props.description ?? '');
	}, [props.description]);

	useEffect(() => {
		api.get<IEntidadeGenerica[]>('merchant/category').then(response => {
			let options = response.data
				.map(t => {
					return {
						value: t.id,
						label: t.name,
					};
				})
				.sort((a, b) => {
					return ('' + a.label).localeCompare(b.label);
				});
			setTipoDominio(options);
		});
	}, []);

	//#region METHODS

	function clearFields() {
		setDescription('');
		setChave('');
		setTipo(null);
	}

	//#endregion

	//#region HANDLERS

	function handleClose() {
		if (props.onClose) props.onClose();
		clearFields();
	}

	function handleOnChangeDomainType(e: IValueLabelPair | null) {
		setTipo(e);
	}

	async function salvarEstabelecimento(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const data = {
			descricao: description,
			palavrachave: chave,
			classificacao: { id: tipo?.value },
		};

		try {
			await api.post('estabelecimento/cadastrar', data);

			clearFields();

			alert('Cadastrado com sucesso');

			/*
			queryClient.invalidateQueries(['estabelecimentos']);
			const estabs = await queryClient.getQueryData<IGrupoClassificacao[]>(['estabelecimentos']);
			estabs?.push()
			queryClient.setQueriesData(['estabelecimentos'], estabs);
			*/
		} catch (error) {
			alert('Ocorreu um problema ao cadastrar estabelecimento, tenta novamente');
		}
	}

	//#endregion

	//#region STYLED

	const Footer = styled.div`
		padding: 5px;
	`;

	//#endregion

	return (
		<Modal
			show={props.show}
			dialogClassName='modalNovoEstabelecimento'
			backdropClassName='modalNovoEstabelecimento-backdrop'
			onHide={handleClose}
			centered
			size='sm'
		>
			<Modal.Header closeButton>
				<Modal.Title>Novo Estabelecimento</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<section>
					<p>Informe os dados do novo estabelecimento</p>
				</section>
				<form onSubmit={e => salvarEstabelecimento(e)}>
					<input
						placeholder='Informe a descrição'
						value={description}
						onChange={e => setDescription(e.target.value)}
						className='form-control'
					/>
					<input placeholder='Informe a palavra chave' value={chave} onChange={e => setChave(e.target.value)} className='form-control' />
					<Select
						defaultValue={{
							value: '0',
							label: 'Selecione...',
						}}
						value={tipo}
						options={tipoDominio}
						onChange={e => handleOnChangeDomainType(e)}
						className='select-control'
					/>
					<Footer>
						<button className='btn btn-primary' type='submit'>
							Cadastrar
						</button>
					</Footer>
				</form>
			</Modal.Body>
		</Modal>
	);
}
