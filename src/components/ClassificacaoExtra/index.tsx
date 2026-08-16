import React, { useEffect, useState } from 'react';
import { Form, Modal, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';
import { toZonedTime } from 'date-fns-tz';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import api from '../../services/api';
import IClassificacaoExtra from '../../interfaces/IClassificacaoExtra';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import IValueLabelPair from '../../interfaces/IValueLabelPair';

import 'react-datepicker/dist/react-datepicker.css';

interface IClassificacaoExtraFormProps {
	show: boolean;
	item?: IClassificacaoExtra;
	onClose: () => void;
}

export default function ClassificacaoExtraForm(props: IClassificacaoExtraFormProps) {
	const isEdit = !!props.item;

	const [name, setName] = useState('');
	const [prefix, setPrefix] = useState('');
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);
	const [categoria, setCategoria] = useState<IValueLabelPair | null>();
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [active, setActive] = useState(true);
	const [loadingDominio, setLoadingDominio] = useState(true);

	const queryClient = useQueryClient();

	useEffect(() => {
		api.get<IEntidadeGenerica[]>('merchant/category').then(response => {
			const options = response.data
				.map(t => ({ value: t.id, label: t.name }))
				.sort((a, b) => ('' + a.label).localeCompare(b.label));
			setTipoDominio(options);
			setLoadingDominio(false);
		});
	}, []);

	useEffect(() => {
		if (props.item) {
			setName(props.item.name);
			setPrefix(props.item.prefix);
			setCategoria({
				value: props.item.categoryId,
				label: props.item.categoryName,
			});
			setStartDate(toZonedTime(props.item.startDate, 'UTC'));
			setEndDate(toZonedTime(props.item.endDate, 'UTC'));
			setActive(props.item.active);
		} else {
			clearFields();
		}
	}, [props.item]);

	//#region METHODS

	function clearFields() {
		setName('');
		setPrefix('');
		setCategoria(null);
		setStartDate(new Date());
		setEndDate(new Date());
		setActive(true);
	}

	function formatDateOnly(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function validate(): boolean {
		if (!name.trim()) {
			alert('Informe o nome');
			return false;
		}
		if (!prefix.trim()) {
			alert('Informe o prefixo');
			return false;
		}
		if (!categoria?.value) {
			alert('Selecione a categoria');
			return false;
		}
		if (startDate > endDate) {
			alert('Data de início não pode ser depois da data de fim');
			return false;
		}
		return true;
	}

	//#endregion

	//#region HANDLERS

	function handleClose() {
		props.onClose();
		clearFields();
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!validate()) return;

		const basePayload = {
			name,
			prefix,
			categoryId: categoria?.value,
			startDate: formatDateOnly(startDate),
			endDate: formatDateOnly(endDate),
		};

		try {
			if (isEdit && props.item) {
				await api.put(`extra-category/${props.item.id}`, {
					...basePayload,
					active,
				});
			} else {
				await api.post('extra-category', basePayload);
			}

			queryClient.invalidateQueries(['classificacaoextra']);
			clearFields();
			props.onClose();
		} catch (error) {
			alert(
				isEdit
					? 'Ocorreu um problema ao atualizar a classificação extra, tente novamente'
					: 'Ocorreu um problema ao cadastrar a classificação extra, tente novamente'
			);
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
			dialogClassName='modalClassificacaoExtra'
			backdropClassName='modalClassificacaoExtra-backdrop'
			onHide={handleClose}
			centered
			size='sm'
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{isEdit ? 'Editar Classificação Extra' : 'Nova Classificação Extra'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={e => handleSubmit(e)}>
					<input
						placeholder='Nome'
						value={name}
						onChange={e => setName(e.target.value)}
						className='form-control'
					/>
					<input
						placeholder='Prefixo'
						value={prefix}
						onChange={e => setPrefix(e.target.value)}
						className='form-control'
					/>
					{loadingDominio ? (
						<Spinner animation='grow' variant='dark' />
					) : (
						<Select
							id='drpCategoria'
							value={categoria}
							options={tipoDominio}
							onChange={e => setCategoria(e)}
							defaultValue={{ value: '0', label: 'Selecione...' }}
							className='select-control'
						/>
					)}
					<label className='filter-label' htmlFor='dtStartDate'>
						Data Início
					</label>
					<DatePicker
						id='dtStartDate'
						selected={startDate}
						onChange={(date: Date) => setStartDate(date)}
						locale={ptBr}
						dateFormat='dd/MM/yyyy'
						className='form-control'
					/>
					<label className='filter-label' htmlFor='dtEndDate'>
						Data Fim
					</label>
					<DatePicker
						id='dtEndDate'
						selected={endDate}
						onChange={(date: Date) => setEndDate(date)}
						locale={ptBr}
						dateFormat='dd/MM/yyyy'
						className='form-control'
					/>
					{isEdit && (
						<Form.Check
							type='switch'
							id='swActive'
							label='Ativo'
							checked={active}
							onChange={e => setActive(e.target.checked)}
						/>
					)}
					<Footer>
						<button className='btn btn-primary' type='submit'>
							{isEdit ? 'Salvar' : 'Cadastrar'}
						</button>
					</Footer>
				</form>
			</Modal.Body>
		</Modal>
	);
}
