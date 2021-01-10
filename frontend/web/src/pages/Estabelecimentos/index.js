import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import Table from 'react-bootstrap/Table';
import {Link} from 'react-router-dom';

import api from '../../services/api';
import './styles.css';

export default function Estabelecimentos(){
    
  function handleEdit(row){
    //console.log(row);
  }

  function handleDelete(row){

  }

  const [data, setData] = useState([]);

  useEffect(()=>{
        api.get('estabelecimento')
        .then(response=>{
              setData(response.data);
          });
      },
      []
  );
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Descrição',
        accessor: 'descricao',
        width: 100
      },
      {
        Header: 'Palavra Chave',
        accessor: 'palavraChave'
      },
      {
        Header: 'Classificação',
        accessor: 'classificacao.descricao'
      },
      {
        Header: '',
        id: 'editar',
        Cell: ({row})=>(
          <div>
            <Link to={`/editarestabelecimento/${row.original.id}`}>Edit</Link>
          </div>
        )
      }
    ],
    []
  )

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
  } = useTable({columns, data, useSortBy});

    return (
      <Table {...getTableProps()} className="table table-striped">
        <thead className="thead-dark">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
}