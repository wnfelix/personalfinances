import React,{useState, useEffect} from 'react';
import Select from 'react-select';

import './styles.css';

import api from '../../services/api'

export default function NovoEstabelecimento(){
    const [description,setDescription] = useState('');
    const [chave,setChave] = useState('');
    const [tipoDominio, setTipoDominio] = useState([]);
    const [tipo,setTipo] = useState(null);

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
    
    function handleOnChangeDomainType(e){
        setTipo(e);
    }

    async function salvarEstabelecimento(e){
        e.preventDefault();

        const data = {
            descricao: description,
            palavrachave: chave,
            classificacao: {id: tipo.value}
        };
        
        try {
            await api.post('estabelecimento/cadastrar', data);
            
            setDescription('');
            setChave('');
            setTipo(null);

            alert('Cadastrado com sucesso');
        } catch (error) {
            alert('Ocorreu um problema ao cadastrar estabelecimento, tenta novamente');
        }
    }

    return(
        <div className="novo-estabelecimento-container">
            <div className="content">
                <section>
                    <p>Informe os dados do novo estabelecimento</p>
                </section>
                <form onSubmit={salvarEstabelecimento}>
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
                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}