import React from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import LeftSideToolBar from '../../components/LeftSideToolBar';
import api from '../../services/api';
import { format, addMonths } from 'date-fns';
import { useState } from 'react';

import './LancamentoUpload.css';

export default function LancamentoUpload() {

    const [selectedMonth, setSelectedMonth] = useState(format(addMonths(Date.now(), -1), 'yyyy-MM'));
    const [sheetFiles, setSheetFiles] = useState<FileList>();

    function uploadFiles(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (sheetFiles) {
            const data = new FormData();
            data.append('Plan', sheetFiles[0]);

            api.post(`lancamento?mesref=${selectedMonth}-01`, data, { responseType: 'blob' })
                .then(result => {
                    const blob = new Blob([result.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

                    const url = URL.createObjectURL(blob)
                    window.open(url);
                });
        }
    }

    return (
        <div
            className="application-content lancamentoupload"
        >
            <LeftSideToolBar />
            <div className="application-header">

            </div>
            <form className="application-body" onSubmit={uploadFiles} >
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
            </form>
        </div>
    )
}