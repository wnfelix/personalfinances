import React, { useEffect, useState } from 'react';
import {
	Dropdown,
	DropdownButton,
	Form,
	Modal,
	Spinner,
} from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';
import { format, addMonths } from 'date-fns';

import LeftSideToolBar from '../../components/LeftSideToolBar';
import HeaderToolBar from '../../components/HeaderToolBar';
import api from '../../services/api';

import Master from '../Master';
import { Distinct } from '../../Helper/helper';
import IValueLabelPair from '../../interfaces/IValueLabelPair';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import InputNumber from '../../components/InputNumber';
import './styles.css';

interface IExpense {
	id: number;
	referenceDate: Date;
	transactionDate: Date;
	memo: string;
	amount: number;
	category: { group: { name: string } };
	memoRule: {
		memoText: string;
		category: {
			name: string;
		};
	};
	installments: boolean;
	reclassified: boolean;
	finalCategory: IEntidadeGenerica;
}

export default function Lancamentos() {
	const [selectedMonth, setSelectedMonth] = useState(
		format(addMonths(Date.now(), -1), 'yyyy-MM')
	);
	const [purchases, setPurchases] = useState<IExpense[]>([]);
	const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);

	const [loadingState, setLoadingState] = useState(true);
	const [loadingDominio, setLoadingDominio] = useState(true);
	const [showModalInsert, setShowModalInsert] = useState(false);

	const [descricao, setDescricao] = useState('');
	const [tipo, setClassificacao] = useState<IValueLabelPair | null>();
	const [dataCompra, setDataCompra] = useState(new Date());
	const [valor, setValor] = useState(0);

	useEffect(() => {
		setLoadingState(true);
		api.get<IExpense[]>(`expense?referenceDate=${selectedMonth}-01`)
			.then(result => {
				setPurchases(result.data);
				console.log(
					result.data.filter(x => x.finalCategory === undefined)
				);
			})
			.catch(e => {
				console.log(e);
			})
			.finally(() => {
				setLoadingState(false);
			});

		api.get<IEntidadeGenerica[]>('merchant/category').then(response => {
			const options = response.data
				.map(t => ({ value: t.id, label: t.name }))
				.sort((a, b) => ('' + a.label).localeCompare(b.label));

			setTipoDominio(options);
			setLoadingDominio(false);
		});
	}, [selectedMonth]);

	function showModalLancamentoManual() {
		return (
			<Modal
				show={showModalInsert}
				onHide={() => setShowModalInsert(false)}
				dialogClassName='modalLancamentoManual'
				size='sm'
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
								defaultValue={{
									value: '0',
									label: 'Selecione...',
								}}
								className='select-control'
							/>
						)}
						<DatePicker
							selected={dataCompra}
							onChange={handleDataCompra}
							locale={ptBr}
							dateFormat='dd/MM/yyyy'
							className='form-control'
						/>
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

	function handleDataCompra(date: Date) {
		setDataCompra(date);
	}

	function handleNovoLancamento(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const data = {
			categoryId: tipo?.value,
			transactionDate: dataCompra,
			referenceDate: dataCompra,
			rawDescription: descricao,
			memo: descricao,
			manual: true,
			amount: valor,
		};

		if (
			data.rawDescription.length > 0 &&
			data.categoryId !== undefined &&
			data.amount > 0
		) {
			api.post('expense', data).then(() => {
				alert('Cadastrado com sucesso');
				setClassificacao(null);
				setDescricao('');
				setValor(0);
			});
		}
	}

	return (
		<Master title='Lançamentos'>
			<div className='lancamentos'>
				{showModalLancamentoManual()}
				<div className='application-header'>
					{/* <Button onClick={() => setShowModalInsert(true)}>Novo</Button> */}
					{/* <Button onClick={() => console.log('teste')}>Upload</Button> */}
					<HeaderToolBar
						title={{ text: 'Lançamentos', url: '/lancamentos' }}
						links={[
							{
								text: 'Novo',
								url: '',
								onClick: () => setShowModalInsert(true),
							},
							{ text: 'Upload', url: '/lancamentoupload' },
						]}
					/>
				</div>
				{loadingState ? (
					<div className='loadingState'>
						<Spinner animation='grow' variant='dark' />
					</div>
				) : (
					<div className='application-body'>
						<div>
							<DropdownButton
								id='dropdown-basic-button'
								title={format(
									new Date(
										Date.parse(
											`${selectedMonth}-01T00:00:00.0000`
										)
									),
									'MM/yyyy'
								)}
								onSelect={(eventKey: any) =>
									setSelectedMonth(eventKey)
								}
							>
								{[
									{
										id: format(new Date(), 'yyyy-MM'),
										value: format(new Date(), 'MM/yyyy'),
									},
									{
										id: format(
											addMonths(new Date(), -1),
											'yyyy-MM'
										),
										value: format(
											addMonths(new Date(), -1),
											'MM/yyyy'
										),
									},
									{
										id: format(
											addMonths(new Date(), -2),
											'yyyy-MM'
										),
										value: format(
											addMonths(new Date(), -2),
											'MM/yyyy'
										),
									},
									{
										id: format(
											addMonths(new Date(), -3),
											'yyyy-MM'
										),
										value: format(
											addMonths(new Date(), -3),
											'MM/yyyy'
										),
									},
								].map(d => (
									<Dropdown.Item
										eventKey={d.id}
										active={selectedMonth === d.id}
									>
										{d.value}
									</Dropdown.Item>
								))}
							</DropdownButton>
						</div>
						{Distinct(
							purchases?.map(p => ({
								id: p.finalCategory.id,
								name: p.finalCategory.name,
							}))
						).map(grupo => (
							<fieldset key={grupo.id}>
								<legend>{grupo.name}</legend>
								<table>
									<thead>
										<tr>
											<th>Ref.</th>
											<th>Compra</th>
											<th>Descrição</th>
											<th>Valor</th>
										</tr>
									</thead>
									<tbody>
										{purchases
											?.filter(
												i =>
													i.finalCategory.id ===
													grupo.id
											)
											.sort((a, b) =>
												new Date(a.transactionDate) >
												new Date(b.transactionDate)
													? 1
													: -1
											)
											.map(p => (
												<tr
													className={`lanc-${
														p.installments &&
														p.reclassified
															? 'parc lanc-reclass'
															: p.reclassified
															? 'reclass'
															: p.installments
															? 'parc'
															: ''
													}`}
												>
													<td>
														{format(
															new Date(
																p.referenceDate
															),
															'MM/yy'
														)}
													</td>
													<td>
														{format(
															new Date(
																p.transactionDate
															),
															'dd/MM/yy'
														)}
													</td>
													<td>{p.memo}</td>
													<td className='valor'>
														{new Intl.NumberFormat(
															'pt-BR',
															{
																style: 'currency',
																currency: 'BRL',
															}
														).format(p.amount)}
													</td>
												</tr>
											))}
										<tr>
											<td colSpan={5} className='total'>
												{new Intl.NumberFormat(
													'pt-BR',
													{
														style: 'currency',
														currency: 'BRL',
													}
												).format(
													purchases
														?.filter(
															i =>
																i.finalCategory
																	.id ===
																grupo.id
														)
														.reduce(
															(add, item) =>
																add +
																item.amount,
															0
														)
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</fieldset>
						))}
					</div>
				)}
			</div>
		</Master>
	);
}
