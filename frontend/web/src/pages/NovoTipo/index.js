import React,{useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Select from 'react-select';

import './styles.css';
import api from '../../services/api';

export default function NovoTipoEstabelecimento(){
    const [description,setDescription] = useState('');
    const [domainType,setDomainType] = useState(null);
    const [typeList,setTypeList] = useState([]);
    const history = useHistory();

    useEffect(()=>{
        api.get('dominio')
        .then(response=>{
            let options = response.data.map(item=>{
                return {value: item.id, label: item.descricao};
            }).sort((a,b)=>{
                return ('' + a.label).localeCompare(b.label);
            });
            setTypeList(options);
        })
    },[]);

    function handleOnChangeDomainType(e){
        setDomainType(e);
    }

    async function handleCadastrar(e){
        e.preventDefault();

        const data = {
            descricao: description,
            dominio: {id: domainType.value}
        };
        
        try {
            await api.post('tipodominio',data);
            
            history.push('/');
        } catch (error) {
            alert('Ocorreu um eror ao tentar cadastrar');  
        }
    }

    return (
        <div className="novotipoestabelecimento-container">
            <div className="content">
                <section>
                    <p>Incluir Novo Tipo</p>
                </section>
                <section>
                    <form onSubmit={handleCadastrar}>
                        <input placeholder="Informe a descrição"
                            onChange={e=>setDescription(e.target.value)}
                        />
                        <Select
                            defaultValue={{value:"0", label:"Selecione o Domínio"}}
                            options={typeList}
                            onChange={handleOnChangeDomainType}
                            className="select-control"
                        />
                        <button className="button" type="submit">Cadastrar</button>
                    </form>
                </section>
            </div>
        </div>
    );
}