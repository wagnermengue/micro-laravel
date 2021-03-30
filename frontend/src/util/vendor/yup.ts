import {LocaleObject, setLocale} from "yup";

const ptBR: LocaleObject = {
    mixed: {
        required: '${path} é requerido',
        notType: '${path} é inválido'
    },
    string: {
        max: '${path} é precisa ter no máximo ${max} caracteres'
    },
    number: {
        min: '${path} é precisa ter no mínimo ${min} caracteres'
    }
}

setLocale(ptBR);

export * from 'yup';