import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ptBr from 'date-fns/locale/pt-BR'
import HeaderToolBar from '../components/HeaderToolBar';
import LeftSideToolBar from '../components/LeftSideToolBar';
import IEntidadeGenerica from '../interfaces/IEntidadeGenerica';
import IEstabelecimento from '../interfaces/IEstabelecimento';
import IValueLabelPair from '../interfaces/IValueLabelPair';

import api from '../services/api';

import "react-datepicker/dist/react-datepicker.css";
import { Form } from 'react-bootstrap';

export default function NovaDescricaoExtra() {
    const [tipoDominio, setTipoDominio] = useState<IValueLabelPair[]>([]);
    const [estabelecimentos, setEstabelecimentos] = useState<IValueLabelPair[]>();
    const [descricao, setDescricao] = useState("");
    const [tipo, setClassificacao] = useState<IValueLabelPair | null>();
    const [estab, setEstab] = useState<IValueLabelPair | null>();
    const [dataCompra, setDataCompra] = useState(new Date());
    const [indiceDe, setIndiceDe] = useState(1);
    const [indiceAte, setIndiceAte] = useState(2);

    useEffect(() => {
        api.get<IEntidadeGenerica[]>('tipodominio?iddominio=1')
            .then(response => {
                let options = response.data.map(t => {
                    return { value: t.id, label: t.descricao };
                }).sort((a, b) => {
                    return ('' + a.label).localeCompare(b.label);
                });
                setTipoDominio(options);
            });

        api.get<IEstabelecimento[]>('estabelecimento')
            .then(response => {
                setEstabelecimentos(response.data.map(e => ({ value: e.id, label: e.palavraChave })));
            });
    }, []);

    function handleNovaDescricaoExtra(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = {
            estabelecimento: {
                id: estab?.value,
            },
            classificacao: {
                id: tipo?.value
            },
            dataCompra: dataCompra,
            indiceCompraDe: indiceDe,
            indiceCompraAte: indiceAte,
            descricao: descricao
        };

        api.post('descricaoextra', data)
            .then(result => {
                alert("Cadastrado com sucesso");
                setEstab(null);
                setClassificacao(null);
                setDescricao("");
                setIndiceDe(1);
            });
    }

    function handleDataCompra(date: Date) {
        setDataCompra(date);
    }

    return (
        <div className="application-content novadescricaoextra">
            <LeftSideToolBar />
            <div className="application-header">
                <HeaderToolBar
                    title={{ text: "Descrição extra", url: "/descricaoextra" }}
                    links={[{ text: "Nova", url: "/novadescricaoextra" }]}
                />
            </div>
            <div className="application-body">
                <section>
                    Incluir nova descrição extra
                </section>
                <form onSubmit={e => handleNovaDescricaoExtra(e)} >
                    <Form.Control
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        type="text"
                        placeholder="Informe a descrição"
                        maxLength={200} />
                    <Select
                        id="drpEstabelecimentos"
                        value={estab}
                        options={estabelecimentos}
                        onChange={e => setEstab(e)}
                        defaultValue={{ value: "0", label: "Selecione..." }}
                    />
                    <Select
                        id="drpTipoDominio"
                        value={tipo}
                        options={tipoDominio}
                        onChange={e => setClassificacao(e)}
                        defaultValue={{ value: "0", label: "Selecione..." }}
                    />
                    <DatePicker
                        selected={dataCompra}
                        onChange={handleDataCompra}
                        locale={ptBr}
                        dateFormat="dd/MM/yyyy"
                    />
                    <fieldset className="indice">
                        <legend>Índice da compra no dia</legend>
                        <label>De</label><input value={indiceDe} type="number" min="1" max="10" onChange={e => setIndiceDe(Number(e.target.value))} />
                        <label>Até</label><input value={indiceAte} type="number" min="1" max="10" onChange={e => setIndiceAte(Number(e.target.value))} />
                    </fieldset>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </form>
            </div>
        </div>
    )
}