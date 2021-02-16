import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { BsFileEarmarkPlus, BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import LeftSideToolBar from '../components/LeftSideToolBar';
import IEstabelecimento from '../interfaces/IEstabelecimento';
import api from '../services/api';

import './Estabelecimentos.css';

export default function Estabelecimentos() {
    const [data, setData] = useState<IEstabelecimento[]>();

    useEffect(() => {
        api.get('estabelecimento')
            .then(response => {
                setData(response.data);
            });
    }, []);

    return (
        <div className="estabelecimentos-content">
            <LeftSideToolBar />
            <div className="estabelecimentos-header">
            <Link to={"/novoestabelecimento"}>
                <BsFileEarmarkPlus size={26}>Novo</BsFileEarmarkPlus>
            </Link>
            </div>
            <div className="estabelecimentos-body">
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Descrição</th>
                            <th>Palavra Chave</th>
                            <th>Classificação</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(e => {
                            return (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.descricao}</td>
                                    <td>{e.palavraChave}</td>
                                    <td>{e.classificacao.descricao}</td>
                                    <td>
                                        <Link to={`/editarestabelecimento/${e.id}`}>
                                            <BsPencilSquare size={20} color="rgb(54, 96, 146)" />
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>)
}