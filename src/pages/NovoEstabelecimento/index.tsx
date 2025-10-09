import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import api from '../../services/api';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import IValueLabelPair from '../../interfaces/IValueLabelPair';
import LeftSideToolBar from '../../components/LeftSideToolBar';
import HeaderToolBar from '../../components/HeaderToolBar';
import './styles.css';

export default function NovoEstabelecimento() {
	const history = useNavigate();
	const params = new URLSearchParams(useLocation().search);

	const [description, setDescription] = useState('');
	const [chave, setChave] = useState(params.get('description') ?? '');
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);
	const [tipo, setTipo] = useState<IValueLabelPair | null>();

	useEffect(() => {
		api.get<IEntidadeGenerica[]>('tipodominio?iddominio=1').then(
			response => {
				let options = response.data
					.map(t => {
						return { value: t.id, label: t.name };
					})
					.sort((a, b) => {
						return ('' + a.label).localeCompare(b.label);
					});
				setTipoDominio(options);
			}
		);
	}, []);

	function handleOnChangeDomainType(e: IValueLabelPair | null) {
		setTipo(e);
	}

	function handleBackButton(e: React.MouseEvent<HTMLElement, MouseEvent>) {
		e.preventDefault();
		history(-1);
	}

	async function salvarEstabelecimento(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const data = {
			name: description,
			pattern: chave,
			categoryId: tipo?.value,
		};

		try {
			await api.post('merchant', data);

			setDescription('');
			setChave('');
			setTipo(null);

			alert('Cadastrado com sucesso');
		} catch (error) {
			alert(
				'Ocorreu um problema ao cadastrar estabelecimento, tenta novamente'
			);
		}
	}

	return (
		<div className='application-content novoestabelecimento'>
			<LeftSideToolBar />
			<div className='application-header'>
				<HeaderToolBar
					title={{
						text: 'Estabelecimentos',
						url: '/estabelecimentos',
					}}
					links={[
						{
							text: 'Novo',
							url: '/novoestabelecimento',
						},
					]}
				/>
			</div>
			<div className='application-body'>
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
					<input
						placeholder='Informe a palavra chave'
						value={chave}
						onChange={e => setChave(e.target.value)}
						className='form-control'
					/>
					<Select
						defaultValue={{ value: '0', label: 'Selecione...' }}
						value={tipo}
						options={tipoDominio}
						onChange={e => handleOnChangeDomainType(e)}
						className='select-control'
					/>
					<div>
						<Button variant='secondary' onClick={handleBackButton}>
							Voltar
						</Button>
						<button className='btn btn-primary' type='submit'>
							Cadastrar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
