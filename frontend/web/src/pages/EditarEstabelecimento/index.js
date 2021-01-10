import React,{useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import Select from 'react-select';

import api from '../../services/api';

import './styles.css';

export default function EditarEstabelecimento(){
    const {id} = useParams();
    const [description,setDescription] = useState('');
    const [chave,setChave] = useState('');
    const [tipoDominio, setTipoDominio] = useState([]);
    const [tipo,setTipo] = useState(null);
    
    const history = useHistory();

    useEffect(()=>{
        api.get('tipodominio?iddominio=1')
        .then(response=>{
            let options = response.data.map(t=>{
                return {value: t.id, label: t.descricao};
            }).sort((a,b)=>{
                return ('' + a.label).localeCompare(b.label);
            });
            setTipoDominio(options);
            
        })
    },[]);

    useEffect(()=>{
        api.get(`estabelecimento/${id}`)
        .then(response=>{
            setDescription(response.data.descricao);
            setChave(response.data.palavraChave);
            setTipo(
            {
                value: response.data.classificacao.id,
                label: response.data.classificacao.descricao 
            });
        });
    },[]);

    async function handleEditarEstabelecimento(e){
        e.preventDefault();

        const data = {
            id: id,
            descricao: description,
            palavrachave: chave,
            classificacao: {id: tipo.value}
        }

        try {
            await api.put('estabelecimento',data);
            
            history.push('/');

        } catch (error) {
            
        }
    }

    function handleOnChangeDomainType(e){
        setTipo(e);
        console.log(e);
    }

    return (
        <div className="estabelecimento-container">
            <div className="content">
                <section>
                    <p>Editar Dados do Estabelecimento</p>
                </section>
                <form onSubmit={handleEditarEstabelecimento}>
                    <input placeholder="Informe a descrição"
                        value={description}
                        onChange={e=>setDescription(e.target.value)}
                    />
                    <input placeholder="Informe a palavra chave"
                        value={chave}
                        onChange={e=>setChave(e.target.value)}
                    />
                    <Select 
                        value={tipo}
                        options={tipoDominio}
                        onChange={handleOnChangeDomainType}
                        className="select-control"
                    />
                    <button className="button" type="submit">Editar</button>
                </form>
            </div>
        </div>
    )
}