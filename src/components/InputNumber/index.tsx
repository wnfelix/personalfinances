import { TextField } from '@material-ui/core';
import React from 'react';
import NumberFormat from 'react-number-format';

interface InputNumberProps {
    inputRef?: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    thousandSeparator?: string
    decimalSeparator?: string
    decimalScale?: number
    fixedDecimalScale?: boolean
    prefix?: string
    className?: string
    defaultValue?: number
    placeholder?: string
    maxLength?: number
    storageKey?: string
}

export default function InputNumber(props: InputNumberProps) {
    const { inputRef, onChange, ...other } = props;
    const length = props.maxLength ?? 9;

    const maxLength = Number('9'.repeat(length - (props.decimalScale ?? 0))
        .concat(props.decimalScale ? '.' : '', '9'
            .repeat(props.decimalScale ?? 0)));

    return <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
            onChange({
                target: {
                    name: props.name,
                    value: values.value.length > 0 ? values.value : '0',
                },
            });
        }}
        customInput={TextField}
        thousandSeparator={props.thousandSeparator ?? '.'}
        decimalSeparator={props.decimalSeparator ?? ','}
        decimalScale={props.decimalScale ?? 0}
        fixedDecimalScale={props.fixedDecimalScale ?? false}
        className={props.className}
        defaultValue={props.defaultValue}
        prefix={props.prefix}
        placeholder={props.placeholder}
        isAllowed={values => values.formattedValue === '' || (values.floatValue !== undefined && values.floatValue <= maxLength)}
    />
};