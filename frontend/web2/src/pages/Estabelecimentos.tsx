import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import HeaderToolBar from '../components/HeaderToolBar';
import LeftSideToolBar from '../components/LeftSideToolBar';
import IEstabelecimento from '../interfaces/IEstabelecimento';
import api from '../services/api';

import './Estabelecimentos.css';
import { TiTrash } from 'react-icons/ti';
import { Modal } from 'react-bootstrap';
import { Distinct } from '../Helper/helper';
import IEntidadeGenerica from '../interfaces/IEntidadeGenerica';

interface IGrupoClassificacao extends IEntidadeGenerica {
    estabelecimentos: IEstabelecimento[]
}

export default function Estabelecimentos() {
    const [data, setData] = useState<IGrupoClassificacao[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState({ show: false, item: { id: 0, idGr: 0 } });
    const [loadingState, setLoadingState] = useState(true);

    useEffect(() => {
        api.get<IEstabelecimento[]>('estabelecimento')
            .then(response => {

                const groups = Distinct(response.data.map(x => x.classificacao));

                groups.forEach(gr => {
                    data.push({ id: gr.id, descricao: gr.descricao, estabelecimentos: response.data.filter(x => x.classificacao.id === gr.id).sort((a, b) => a.lancamentosTotal > b.lancamentosTotal ? -1 : 1) });
                });

                setData(data);
                setLoadingState(false);
            });
    }, []);

    function handleDelete() {
        const { id, idGr } = showDeleteDialog.item;

        api.delete(`estabelecimento/${id}`)
            .then(result => {
                alert('deu certo');
            });

        const indexGr = data.findIndex(x => Number(x.id) === idGr);
        data[indexGr].estabelecimentos = data[indexGr].estabelecimentos.filter(x => Number(x.id) !== id);
        setData([...data]);
        
        setShowDeleteDialog({ show: false, item: { id: 0, idGr: 0 } });
    }

    function modalDelete() {
        return (
            <Modal show={showDeleteDialog.show} onHide={() => setShowDeleteDialog({ show: false, item: { id: 0, idGr: 0 } })} >
                <Modal.Header closeButton>
                    <Modal.Title>Excluir Estabelecimento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Confirma exclusão do registro {showDeleteDialog.item.id}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteDialog({ show: false, item: { id: 0, idGr: 0 } })}>Cancelar</Button>
                    <Button variant="primary" onClick={() => handleDelete()}>Excluir</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div className="application-content estabelecimentos">
            {modalDelete()}
            <LeftSideToolBar />
            <div className="application-header">
                <HeaderToolBar
                    title={{ text: "Estabelecimentos", url: "/estabelecimentos" }}
                    links={[{ text: "Novo", url: "/novoestabelecimento" }]}
                />
            </div>
            {loadingState ?
                <div className="loadingState"><Spinner animation="grow" variant="dark" /></div>
                :
                <div className="application-body">
                    {data?.map(gr => {
                        return (
                            <fieldset>
                                <legend>{gr.descricao}</legend>
                                {gr.estabelecimentos.map(e =>
                                    <Card key={e.id}>
                                        <Card.Header>
                                            <Card.Text>{e.palavraChave}</Card.Text>
                                        </Card.Header>
                                        <Card.Body>
                                            {e.descricao?.length > 0 &&
                                                <Card.Text>{e.descricao}</Card.Text>
                                            }
                                            {e.lancamentosTotal > 0 &&
                                                <div className="total" title="Total de Lançamentos">{e.lancamentosTotal} lançamento(s)</div>
                                            }
                                            {e.descricoesExtrasTotal > 0 &&
                                                <div className="total" title="Descrição Extra">{e.descricoesExtrasTotal} reclassificado(s)</div>
                                            }
                                        </Card.Body>
                                        <Card.Footer>
                                            <Link to={`/editarestabelecimento/${e.id}`}>
                                                <BsPencilSquare size={20} color="rgb(54, 96, 146)" />
                                            </Link>
                                            <TiTrash size={25} onClick={() => setShowDeleteDialog({ show: true, item: { id: Number(e.id), idGr: Number(gr.id) } })} color="rgb(130, 11, 17)" />
                                        </Card.Footer>
                                    </Card>
                                )}
                            </fieldset>
                        )
                    })}
                </div>
            }
        </div>)
}