import React, { useEffect } from 'react';
import { Button, Dropdown, DropdownButton, Form, Spinner } from 'react-bootstrap';
import LeftSideToolBar from '../../components/LeftSideToolBar';
import api from '../../services/api';
import { format, addMonths } from 'date-fns';
import { useState } from 'react';

import './LancamentoUpload.css';
import HeaderToolBar from '../../components/HeaderToolBar';

interface IPurchase {
    id: number,
    dtReferencia: Date,
    dtCompra: Date,
    descricao: string,
    valor: number,
    estabelecimento: { classificacao: { descricao: string } },
    descricaoExtra: {
        descricao: string,
        classificacao: {
            descricao: string
        }
    }
}

export default function LancamentoUpload() {

    const [selectedMonth, setSelectedMonth] = useState(format(addMonths(Date.now(), -1), 'yyyy-MM'));
    const [sheetFiles, setSheetFiles] = useState<FileList>();
    const [purchases, setPurchases] = useState<IPurchase[]>([]);
    const [loadingState, setLoadingState] = useState(true);
    const [reload, setReload] = useState(true);

    useEffect(() => {
        setLoadingState(true);
        api.get<IPurchase[]>(`lancamento?mesref=${selectedMonth}-01`)
            .then(result => {
                setPurchases(result.data);
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                setLoadingState(false);
                setReload(false);
            })
    }, [selectedMonth, reload])

    function uploadFiles(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (sheetFiles) {
            setLoadingState(true);
            const data = new FormData();
            data.append('Plan', sheetFiles[0]);

            api.post(`lancamento?mesref=${selectedMonth}-01`, data, { responseType: 'blob' })
                .then(result => {
                    const blob = new Blob([result.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

                    const url = URL.createObjectURL(blob)
                    window.open(url);
                    setReload(true);
                }).finally(() => {
                    setLoadingState(false);
                })
        }
    }

    return (
        <div
            className="application-content lancamentoupload"
        >
            <LeftSideToolBar />
            <div className="application-header">
                <HeaderToolBar
                    title={{ text: "Upload de Cartão de Crédito", url: "/lancamentoupload" }}
                    links={[{ text: "Nova", url: "/lancamentoupload" }]}
                />
            </div>
            {loadingState ?
                <div className="loadingState"><Spinner animation="grow" variant="dark" /></div>
                :
                <form className="application-body" onSubmit={uploadFiles} >
                    <div>
                        <Form.Control
                            type="file"
                            size='sm'
                            onChange={(e: any) => setSheetFiles(e.target.files)}
                        />
                        <DropdownButton
                            id="dropdown-basic-button"
                            title={format(new Date(Date.parse(`${selectedMonth}-01T00:00:00.0000`)), 'MM/yyyy')}
                            onSelect={(eventKey: any) => setSelectedMonth(eventKey)}
                        >
                            {
                                [
                                    { id: format(new Date(), 'yyyy-MM'), value: format(new Date(), 'MM/yyyy') },
                                    { id: format(addMonths(new Date(), -1), 'yyyy-MM'), value: format(addMonths(new Date(), -1), 'MM/yyyy') },
                                    { id: format(addMonths(new Date(), -2), 'yyyy-MM'), value: format(addMonths(new Date(), -2), 'MM/yyyy') },
                                ].map(d => (
                                    <Dropdown.Item
                                        eventKey={d.id}
                                        active={selectedMonth === d.id}
                                    >
                                        {d.value}
                                    </Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                        <Button type='submit'>Enviar</Button>
                    </div>
                    <table>
                        <thead>
                            <td>Ref.</td>
                            <td>Compra</td>
                            <td>Descrição</td>
                            <td>Valor</td>
                            <td>Desc. Extra</td>
                            <td>Classificação</td>
                        </thead>
                        {purchases?.map(p =>
                            <tr>
                                <td>{format(new Date(p.dtReferencia), 'MM/yy')}</td>
                                <td>{format(new Date(p.dtCompra), 'dd/MM/yy')}</td>
                                <td>{p.descricao}</td>
                                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}</td>
                                <td>{p.descricaoExtra?.descricao}</td>
                                {p.descricaoExtra ?
                                    <td>{p.descricaoExtra.classificacao.descricao}</td>
                                    :
                                    <td>{p.estabelecimento.classificacao.descricao}</td>
                                }
                            </tr>
                        )}
                    </table>
                </form>
            }
        </div>
    )
}