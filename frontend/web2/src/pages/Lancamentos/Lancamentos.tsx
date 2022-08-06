import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton, Form, Modal, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';
import { format, addMonths } from 'date-fns';

import LeftSideToolBar from '../../components/LeftSideToolBar';
import HeaderToolBar from '../../components/HeaderToolBar';
import api from '../../services/api';

import { Distinct } from '../../Helper/helper';
import IValueLabelPair from '../../interfaces/IValueLabelPair';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import './Lancamentos.css';
import InputNumber from '../../components/Common/InputNumber';

interface IPurchase {
	id: number;
	dtReferencia: Date;
	dtCompra: Date;
	descricao: string;
	valor: number;
	estabelecimento: { classificacao: { descricao: string } };
	descricaoExtra: {
		descricao: string;
		classificacao: {
			descricao: string;
		};
	};
	parcelado: boolean;
	reclassificado: boolean;
	classificacaoFinal: IEntidadeGenerica;
}

export default function Lancamentos() {
	const [selectedMonth, setSelectedMonth] = useState(format(addMonths(Date.now(), -1), 'yyyy-MM'));
	const [purchases, setPurchases] = useState<IPurchase[]>([]);
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
		api.get<IPurchase[]>(`lancamento?mesref=${selectedMonth}-01`)
			.then(result => {
				setPurchases(result.data);
				console.log(result.data.filter(x => x.classificacaoFinal === undefined));
			})
			.catch(e => {
				console.log(e);
			})
			.finally(() => {
				setLoadingState(false);
			});

		api.get<IEntidadeGenerica[]>('tipodominio?iddominio=1').then(response => {
			const options = response.data.map(t => ({ value: t.id, label: t.descricao })).sort((a, b) => ('' + a.label).localeCompare(b.label));

			setTipoDominio(options);
			setLoadingDominio(false);
		});
	}, [selectedMonth]);

	function showModalLancamentoManual() {
		return (
			<Modal show={showModalInsert} onHide={() => setShowModalInsert(false)} dialogClassName='modalLancamentoManual' size='sm'>
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
			classificacao: {
				id: tipo?.value,
			},
			dtCompra: dataCompra,
			descricao: descricao,
			manual: true,
			valor: valor,
		};

		if (data.descricao.length > 0 && data.classificacao?.id !== undefined && data.valor > 0) {
			console.log(data);
			api.post('lancamento', data).then(() => {
				alert('Cadastrado com sucesso');
				setClassificacao(null);
				setDescricao('');
				setValor(0);
			});
		}
	}

	return (
		<div className='application-content lancamentos'>
			<LeftSideToolBar />
			{showModalLancamentoManual()}
			<div className='application-header'>
				{/* <Button onClick={() => setShowModalInsert(true)}>Novo</Button> */}
				{/* <Button onClick={() => console.log('teste')}>Upload</Button> */}
				<HeaderToolBar
					title={{ text: 'Lançamentos', url: '/lancamentos' }}
					links={[
						{ text: 'Novo', url: '', onClick: () => setShowModalInsert(true) },
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
							title={format(new Date(Date.parse(`${selectedMonth}-01T00:00:00.0000`)), 'MM/yyyy')}
							onSelect={(eventKey: any) => setSelectedMonth(eventKey)}
						>
							{[
								{ id: format(new Date(), 'yyyy-MM'), value: format(new Date(), 'MM/yyyy') },
								{ id: format(addMonths(new Date(), -1), 'yyyy-MM'), value: format(addMonths(new Date(), -1), 'MM/yyyy') },
								{ id: format(addMonths(new Date(), -2), 'yyyy-MM'), value: format(addMonths(new Date(), -2), 'MM/yyyy') },
								{ id: format(addMonths(new Date(), -3), 'yyyy-MM'), value: format(addMonths(new Date(), -3), 'MM/yyyy') },
							].map(d => (
								<Dropdown.Item eventKey={d.id} active={selectedMonth === d.id}>
									{d.value}
								</Dropdown.Item>
							))}
						</DropdownButton>
					</div>
					{Distinct(purchases?.map(p => ({ id: p.classificacaoFinal.id, descricao: p.classificacaoFinal.descricao }))).map(grupo => (
						<fieldset key={grupo.id}>
							<legend>{grupo.descricao}</legend>
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
										?.filter(i => i.classificacaoFinal.id === grupo.id)
										.sort((a, b) => (new Date(a.dtCompra) > new Date(b.dtCompra) ? 1 : -1))
										.map(p => (
											<tr
												className={`lanc-${
													p.parcelado && p.reclassificado
														? 'parc lanc-reclass'
														: p.reclassificado
														? 'reclass'
														: p.parcelado
														? 'parc'
														: ''
												}`}
											>
												<td>{format(new Date(p.dtReferencia), 'MM/yy')}</td>
												<td>{format(new Date(p.dtCompra), 'dd/MM/yy')}</td>
												<td>{p.descricao}</td>
												<td className='valor'>
													{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
												</td>
											</tr>
										))}
									<tr>
										<td colSpan={5} className='total'>
											{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
												purchases
													?.filter(i => i.classificacaoFinal.id === grupo.id)
													.reduce((add, item) => add + item.valor, 0)
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
	);
}
