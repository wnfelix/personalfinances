import React, { useEffect } from 'react';
import {
	Button,
	Dropdown,
	DropdownButton,
	Form,
	Spinner,
} from 'react-bootstrap';
import { format, addMonths } from 'date-fns';
import { useState } from 'react';
import { VscNewFile } from 'react-icons/vsc';
import { IoReload } from 'react-icons/io5';
import { BsClipboardCheck } from 'react-icons/bs';

import api from '../../services/api';
import HeaderToolBar from '../../components/HeaderToolBar';
import { DistinctBy } from '../../Helper/helper';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';
import NovoEstabelecimento from '../../components/NovoEstabelecimento';
import NovaDescricaoExtra from '../../components/NovaDescricaoExtra';
import NovoLancamento from '../../components/NovoLancamento';
import Master from '../Master';
import './styles.css';

interface IPurchase {
	id: number;
	referenceDate: Date;
	transactionDate: Date;
	rawDescription: string;
	amount: number;
	merchant: {
		id: Number;
		group: IEntidadeGenerica;
	};
	memoRule: {
		memoText: string;
		category: IEntidadeGenerica;
	};
	category: {
		//prefixo: string;
		group: IEntidadeGenerica;
	};
	// classificacao: {
	// 	descricao: string;
	// 	classificacao: IEntidadeGenerica;
	// };
	finalCategory: IEntidadeGenerica & { order: number };
	installments: boolean;
	reclassified: boolean;
	isManual: boolean;
}

export default function LancamentoUpload() {
	const [selectedMonth, setSelectedMonth] = useState(
		format(addMonths(Date.now(), -1), 'yyyy-MM')
	);
	const [sheetFiles, setSheetFiles] = useState<FileList>();
	const [purchases, setPurchases] = useState<IPurchase[]>([]);
	const [loadingState, setLoadingState] = useState(true);
	const [reload, setReload] = useState(false);

	const [descriptionNew, setDescriptionNew] = useState('');

	const [showModalNovoEstabelecimento, setShowModalNovoEstabelecimento] =
		useState(false);
	const [showModalNovaDescricaoExtra, setShowModalNovaDescricaoExtra] =
		useState(false);
	const [showDialogNovoLancamento, setShowModalNovoLancamento] =
		useState(false);

	useEffect(() => {
		setLoadingState(true);
		api.get<IPurchase[]>(`expense?referenceDate=${selectedMonth}-01`)
			.then(result => {
				setPurchases(result.data);
			})
			.catch(e => {
				console.log(e);
			})
			.finally(() => {
				setLoadingState(false);
				setReload(false);
			});
	}, [selectedMonth, reload]);

	function uploadFiles(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (sheetFiles) {
			setLoadingState(true);
			const data = new FormData();
			data.append('file', sheetFiles[0]);

			api.post(`expense/upload?referenceDate=${selectedMonth}-01`, data, {
				responseType: 'blob',
			}).finally(() => {
				setReload(true);
			});
		}
	}

	function downloadExcelFile() {
		setLoadingState(true);
		api.get(`lancamento?mesref=${selectedMonth}-01&download=true`, {
			responseType: 'blob',
		})
			.then(result => {
				const blob = new Blob([result.data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});

				const url = URL.createObjectURL(blob);
				window.open(url);
			})
			.finally(() => {
				setLoadingState(false);
			});
	}

	/**
	 * Get texto do colate on excel
	 * @param groupId groupid filter
	 * @returns concatened values
	 */
	function getClipboardListText(groupId: string): string {
		return purchases
			?.filter(i => i.finalCategory.id === groupId)
			.sort((a, b) =>
				new Date(a.transactionDate) > new Date(b.transactionDate)
					? 1
					: -1
			)
			.map(p =>
				format(new Date(p.transactionDate), 'dd/MM').concat(
					' ',
					p.rawDescription,
					' = ',
					new Intl.NumberFormat('pt-BR', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
						currency: 'BRL',
					}).format(p.amount)
				)
			)
			.join('\r\n');
	}

	function handlerNovaClassificacao(description: string) {
		setDescriptionNew(description);
		setShowModalNovoEstabelecimento(true);
		console.log(description);
	}

	return (
		<Master title='Upload de Lançamentos'>
			<div className='lancamentoupload'>
				<NovoEstabelecimento
					show={showModalNovoEstabelecimento}
					onClose={() => setShowModalNovoEstabelecimento(false)}
					description={descriptionNew}
				/>
				<NovaDescricaoExtra
					show={showModalNovaDescricaoExtra}
					onClose={() => setShowModalNovaDescricaoExtra(false)}
				/>
				<NovoLancamento
					show={showDialogNovoLancamento}
					onClose={() => setShowModalNovoLancamento(false)}
				/>
				<div className='application-header'>
					<HeaderToolBar
						title={{
							text: 'Upload de Lançamentos',
							url: '/lancamentoupload',
						}}
						links={[
							{
								text: 'Descrição Extra',
								url: '',
								onClick: () =>
									setShowModalNovaDescricaoExtra(true),
								title: 'Inclui uma nova descrição extra',
							},
							{
								text: 'Lançamento Manual',
								url: '',
								onClick: () => setShowModalNovoLancamento(true),
								title: 'Inclui um novo lançamento',
							},
						]}
					/>
				</div>
				{loadingState ? (
					<div className='loadingState'>
						<Spinner animation='grow' variant='dark' />
					</div>
				) : (
					<form className='application-body' onSubmit={uploadFiles}>
						<div>
							<Form.Control
								type='file'
								size='sm'
								onChange={(e: any) =>
									setSheetFiles(e.target.files)
								}
							/>
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
							<Button type='submit'>Enviar</Button>
						</div>
						{DistinctBy(
							purchases?.map(p => p.finalCategory),
							'id',
							'order'
						).map(grupo => (
							<fieldset key={grupo.id}>
								<legend>{grupo.name}</legend>
								<table>
									<thead>
										<tr>
											<th></th>
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
														{Number(
															p.finalCategory.id
														) === 0 && (
															<VscNewFile
																size={20}
																onClick={() =>
																	handlerNovaClassificacao(
																		p.rawDescription
																	)
																}
															/>
														)}
														<IoReload size={20} />
													</td>
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
													<td>{p.rawDescription}</td>
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
											<td>
												<BsClipboardCheck
													size={18}
													title='Copiar lista'
													onClick={() =>
														navigator.clipboard.writeText(
															getClipboardListText(
																grupo.id
															)
														)
													}
												/>
											</td>
											<td colSpan={4} className='total'>
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
						<div>
							<Button onClick={downloadExcelFile}>
								Download
							</Button>
							<Button>Reprocessar Dados</Button>
						</div>
					</form>
				)}
			</div>
		</Master>
	);
}
