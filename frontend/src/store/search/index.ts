import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
    setSearch: ['payload'],
    setPage: ['payload'],
    setPerPage: ['payload'],
    setOrder: ['payload'],
});