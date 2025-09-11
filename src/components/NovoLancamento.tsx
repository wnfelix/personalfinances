import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ptBr from 'date-fns/locale/pt-BR';
import IEntidadeGenerica from '../interfaces/IEntidadeGenerica';
import IValueLabelPair from '../interfaces/IValueLabelPair';

import api from '../services/api';

import 'react-datepicker/dist/react-datepicker.css';
import { Form, Modal, Spinner } from 'react-bootstrap';
import InputNumber from './Common/InputNumber';
import { formatDateAndFirstDay } from '../Helper/helper';

interface INovoLancamentoIni {
	show: boolean;
	id?: string;
	onClose?: () => void;
	onLoading?: () => void;
	onLoaded?: () => void;
}

export default function NovoLancamento(props: INovoLancamentoIni) {
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);

	const [descricao, setDescricao] = useState('');
	const [tipo, setClassificacao] = useState<IValueLabelPair | null>();
	const [dataCompra, setDataCompra] = useState(new Date());
	const [valor, setValor] = useState(0);

	const [loadingDominio, setLoadingDominio] = useState(true);

	useEffect(() => {
		api.get<IEntidadeGenerica[]>('merchant/category').then(response => {
			const options = response.data.map(t => ({ value: t.id, label: t.name })).sort((a, b) => ('' + a.label).localeCompare(b.label));

			setTipoDominio(options);
			setLoadingDominio(false);
		});
	}, []);

	//#region METHODS

	function clearFields() {
		setDescricao('');
		setClassificacao(null);
		setValor(0);
	}

	//#endregion

	//#region HANDLERS

	function handleClose() {
		if (props.onClose) props.onClose();
		clearFields();
	}

	function handleNovoLancamento(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const [formattedDate, referenceDate] = formatDateAndFirstDay(dataCompra);

		const data = {
			categoryId: tipo?.value,
			transactionDate: formattedDate,
			referenceDate: referenceDate,
			rawDescription: descricao,
			memo: descricao,
			isManual: true,
			amount: valor,
		};

		if (data.rawDescription.length > 0 && data.categoryId !== undefined && data.amount > 0) {
			api.post('expense', data).then(() => {
				alert('Cadastrado com sucesso');
				setClassificacao(null);
				setDescricao('');
				setValor(0);
			});
		}
	}

	function handleDataCompra(date: Date) {
		setDataCompra(date);
	}

	//#endregion

	return (
		<Modal
			show={props.show}
			dialogClassName='modalNovoLancamento'
			backdropClassName='modalNovoLancamento-backdrop'
			onHide={handleClose}
			size='sm'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Cadastrar Novo Lançamento</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={e => handleNovoLancamento(e)}>
					<Form.Control
						value={descricao}
						onChange={e => setDescricao(e.target.value)}
						type='text'
						placeholder='Informe a descrição'
						className='form-control'
						maxLength={200}
					/>
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
					<label>Valor</label>
					<InputNumber
						name='valor'
						onChange={e => setValor(Number(e.target.value))}
						prefix='R$'
						decimalScale={2}
						fixedDecimalScale={true}
						className='lancamentovalor'
					/>
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
