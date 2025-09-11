import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ptBr from 'date-fns/locale/pt-BR';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import IEstabelecimento from '../../interfaces/IEstabelecimento';
import IValueLabelPair from '../../interfaces/IValueLabelPair';

import api from '../../services/api';

import 'react-datepicker/dist/react-datepicker.css';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { formatDateAndFirstDay } from '../../Helper/helper';

interface INovaDescricaoExtraIni {
	show: boolean;
	id?: string;
	onClose?: () => void;
	onLoading?: () => void;
	onLoaded?: () => void;
}

export default function NovaDescricaoExtra(props: INovaDescricaoExtraIni) {
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);
	const [estabelecimentos, setEstabelecimentos] = useState<IValueLabelPair[]>();
	const [descricao, setDescricao] = useState('');
	const [tipo, setClassificacao] = useState<IValueLabelPair | null>();
	const [estab, setEstab] = useState<IValueLabelPair | null>();
	const [dataCompra, setDataCompra] = useState(new Date());
	const [indiceDe, setIndiceDe] = useState(1);
	const [indiceAte, setIndiceAte] = useState(2);
	const [loadingDominio, setLoadingDominio] = useState(true);
	const [loadingEstab, setLoadingEstab] = useState(true);

	useEffect(() => {
		api.get<IEntidadeGenerica[]>('merchant/category').then(response => {
			const options = response.data.map(t => ({ value: t.id, label: t.name })).sort((a, b) => ('' + a.label).localeCompare(b.label));

			setTipoDominio(options);
			setLoadingDominio(false);
		});

		api.get<IEstabelecimento[]>('merchant').then(response => {
			setEstabelecimentos(response.data.map(e => ({ value: e.id, label: e.pattern })));
			setLoadingEstab(false);
		});
	}, []);

	//#region METHODS

	function clearFields() {
		setEstab(null);
		setClassificacao(null);
		setDescricao('');
		setIndiceDe(1);
	}

	//#endregion

	//#region HANDLERS

	function handleClose() {
		if (props.onClose) props.onClose();
		clearFields();
	}

	function handleNovaDescricaoExtra(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const [formattedDate] = formatDateAndFirstDay(dataCompra);
		const data = {
			merchantId: estab?.value,
			categoryId: tipo?.value,
			memoText: descricao,
			matchDate: formattedDate,
			matchIndexFrom: indiceDe,
			matchIndexTo: indiceAte,
		};

		api.post('memorule', data).then(result => {
			alert('Cadastrado com sucesso');
			clearFields();
		});
	}

	function handleDataCompra(date: Date) {
		setDataCompra(date);
	}

	//#endregion

	return (
		<Modal
			show={props.show}
			dialogClassName='modalNovaDescricaoExtra'
			backdropClassName='modalNovaDescricaoExtra-backdrop'
			onHide={handleClose}
			size='sm'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Nova Descrição Extra</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<section>Incluir nova descrição extra</section>
				<form onSubmit={e => handleNovaDescricaoExtra(e)}>
					<Form.Control
						value={descricao}
						onChange={e => setDescricao(e.target.value)}
						type='text'
						placeholder='Informe a descrição'
						className='form-control'
						maxLength={200}
					/>
					{loadingEstab ? (
						<Spinner animation='grow' variant='dark' />
					) : (
						<Select
							id='drpEstabelecimentos'
							value={estab}
							options={estabelecimentos}
							onChange={e => setEstab(e)}
							defaultValue={{ value: '0', label: 'Selecione...' }}
							className='select-control'
						/>
					)}
					{loadingDominio ? (
						<Spinner animation='grow' variant='dark' />
					) : (
						<Select
							id='drpTipoDominio'
							value={tipo}
							options={tipoDominio}
							onChange={e => setClassificacao(e)}
							defaultValue={{ value: '0', label: 'Selecione...' }}
							className='select-control'
						/>
					)}
					<DatePicker selected={dataCompra} onChange={handleDataCompra} locale={ptBr} dateFormat='dd/MM/yyyy' className='form-control' />
					<fieldset className='indice'>
						<legend>Índice da compra no dia</legend>
						<label>De</label>
						<input
							value={indiceDe}
							className='form-control'
							type='number'
							min='1'
							max='10'
							onChange={e => setIndiceDe(Number(e.target.value))}
						/>
						<label>Até</label>
						<input
							value={indiceAte}
							className='form-control'
							type='number'
							min='1'
							max='10'
							onChange={e => setIndiceAte(Number(e.target.value))}
						/>
					</fieldset>
					<div>
						<button type='submit' className='btn btn-primary'>
							Salvar
						</button>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	);
}
