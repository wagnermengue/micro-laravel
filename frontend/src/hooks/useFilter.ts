import {useReducer, useState} from "react";
import reducer, {INITIAL_STATE} from "../store/filter";

function init(INITIAL_STATE) {
    return INITIAL_STATE;
}

export default function useFilter() {
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE, init);

    return {
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords
    }
}