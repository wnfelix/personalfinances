import React, { useEffect } from 'react';
import { Button, Dropdown, DropdownButton, Form, Spinner } from 'react-bootstrap';
import LeftSideToolBar from '../../components/LeftSideToolBar';
import api from '../../services/api';
import { format, addMonths } from 'date-fns';
import { useState } from 'react';
import { VscNewFile } from 'react-icons/vsc';

import './LancamentoUpload.css';
import HeaderToolBar from '../../components/HeaderToolBar';
import { Distinct } from '../../Helper/helper';
import { useHistory } from 'react-router';
import IEntidadeGenerica from '../../interfaces/IEntidadeGenerica';

interface IPurchase {
    id: number,
    dtReferencia: Date,
    dtCompra: Date,
    descricao: string,
    valor: number,
    estabelecimento: {
        id: Number,
        classificacao: IEntidadeGenerica,
    },
    descricaoExtra: {
        descricao: string,
        classificacao: IEntidadeGenerica,
    },
    classificacaoExtra: {
        prefixo: string,
        classificacao: IEntidadeGenerica,
    },
    parcelado: boolean,
    reclassificado: boolean,
}

export default function LancamentoUpload() {
    const history = useHistory();
    const [selectedMonth, setSelectedMonth] = useState(format(addMonths(Date.now(), -1), 'yyyy-MM'));
    const [sheetFiles, setSheetFiles] = useState<FileList>();
    const [purchases, setPurchases] = useState<IPurchase[]>([]);
    const [loadingState, setLoadingState] = useState(true);
    const [reload, setReload] = useState(false);

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

    /**
     * Define qual a classificacao final do item de lançamento
     * @param item 
     * @returns 
     */
    function pegarClassificacao(item: IPurchase): IEntidadeGenerica {
        if (item.descricaoExtra !== undefined) {
            return item.descricaoExtra.classificacao;
        }
        else if (item.estabelecimento.id > 0) {
            return item.estabelecimento.classificacao;
        }
        else if (item.classificacaoExtra !== undefined) {
            return item.classificacaoExtra.classificacao;
        }
        else {
            return item.estabelecimento.classificacao;
        }
    }

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

    function handlerNovaClassificacao(description: string) {
        history.push(`/novoestabelecimento?description=${description}`);
    }

    return (
        <div
            className="application-content lancamentoupload"
        >
            <LeftSideToolBar />
            <div className="application-header">
                <HeaderToolBar
                    title={{ text: "Upload de Cartão de Crédito", url: "/lancamentoupload" }}
                    links={[]}
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
                                    { id: format(addMonths(new Date(), -3), 'yyyy-MM'), value: format(addMonths(new Date(), -3), 'MM/yyyy') },
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
                    {Distinct(purchases?.map(p => {
                        const key = pegarClassificacao(p);
                        return {
                            id: key.id,
                            descricao: key.descricao
                        };
                    })).map(grupo =>
                        <fieldset key={grupo.id}>
                            <legend>{grupo.descricao}</legend>
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
                                    {purchases?.filter(i => pegarClassificacao(i).id === grupo.id)
                                        .sort((a, b) => new Date(a.dtCompra) > new Date(b.dtCompra) ? 1 : -1)
                                        .map(p =>
                                            <tr className={`lanc-${p.parcelado && p.reclassificado ? 'parc lanc-reclass'
                                                : p.reclassificado ? 'reclass' :
                                                    p.parcelado ? 'parc' : ''}`}>
                                                <td>
                                                    {Number(pegarClassificacao(p).id) === 0 && <VscNewFile size={26} onClick={() => handlerNovaClassificacao(p.descricao)} />}
                                                </td>
                                                <td>{format(new Date(p.dtReferencia), 'MM/yy')}</td>
                                                <td>{format(new Date(p.dtCompra), 'dd/MM/yy')}</td>
                                                <td>{p.descricao}</td>
                                                <td className='valor'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}</td>
                                            </tr>
                                        )}
                                    <tr>
                                        <td colSpan={5} className='total'>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                .format(purchases?.filter(i => pegarClassificacao(i).id === grupo.id)
                                                    .reduce((add, item) => add + item.valor, 0))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    )}
                </form>
            }
        </div>
    )
}