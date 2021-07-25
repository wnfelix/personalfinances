import React, { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import HeaderToolBar from '../components/HeaderToolBar';
import LeftSideToolBar from '../components/LeftSideToolBar';
import IDescricaoExtra from '../interfaces/IDescricaoExtra';

import api from '../services/api';

import './DescricaoExtra.css';

export default function DescricaoExtra() {
    const [descricaoExtra, setDescricaoExtra] = useState<IDescricaoExtra[]>([]);
    const [loadingState, setLoadingState] = useState(true);

    useEffect(() => {
        api.get<IDescricaoExtra[]>('descricaoextra')
            .then(response => {
                setDescricaoExtra(response.data);
                setLoadingState(false);
            })
    }, []);

    return (
        <div className="application-content">
            <LeftSideToolBar />
            <div className="application-header">
                <HeaderToolBar
                    title={{ text: "Descrição extra", url: "/descricaoextra" }}
                    links={[{ text: "Nova", url: "/novadescricaoextra" }]}
                />
            </div>
            {loadingState ?
                <div className="loadingState"><Spinner animation="grow" variant="dark" /></div>
                :
                <div className="application-body">
                    <Table>
                        <thead>
                            <tr>
                                <th>Estabelecimento</th>
                                <th>Classificação</th>
                                <th>Descrição</th>
                                <th>Data da Compra</th>
                                <th>Índice De</th>
                                <th>Índice Até</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {descricaoExtra.map(d => {
                                return <tr>
                                    <td>{d.estabelecimento.palavraChave}</td>
                                    <td>{d.classificacao.descricao}</td>
                                    <td>{d.descricao}</td>
                                    <td>{d.dataCompra}</td>
                                    <td>{d.indiceCompraDe}</td>
                                    <td>{d.indiceCompraAte}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    )
}