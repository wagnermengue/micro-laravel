import * as React from 'react';
import AsyncAutocomplete, {AsyncAutocompleteComponent} from "../../../components/AsyncAutocomplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import {FormControl, Typography, FormControlProps, FormHelperText} from "@material-ui/core";
import useHttpHandle from "../../../hooks/useHttpHandle";
import useCollectionManager from "../../../hooks/useCollectionManager";
import {MutableRefObject, RefAttributes, useCallback, useImperativeHandle, useRef} from "react";
import castMembersHttp from "../../../util/http/castMember-http";

interface CastMemberFieldProps extends RefAttributes<CastMemberFieldProps>{
    castMembers: any[],
    setCastMembers: (castMembers) => void,
    error: any,
    disabled?: boolean,
    FormControlProps?: FormControlProps
}

export interface CastMemberFieldComponent {
    clear: () => void
}

const CastMemberField = React.forwardRef<CastMemberFieldComponent, CastMemberFieldProps>((props, ref) => {
    const {castMembers, setCastMembers, error, disabled} = props;
    const autoCompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(castMembers, setCastMembers);
    const autoCompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;

    const fetchOptions = useCallback((searchText) => {
        return autoCompleteHttp(
            castMembersHttp
                .list({
                    queryParams: {
                        search: searchText,
                        all: ''
                    }})
        ).then(data => data.data);
    }, [autoCompleteHttp]);

    useImperativeHandle(ref, () => ({
        clear: () => autoCompleteRef.current.clear()
    }));

    return (
        <>
            <AsyncAutocomplete
                ref={autoCompleteRef}
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    clearOnEscape: true,
                    getOptionSelected: (option, value) => option.id === value.id,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label: 'Elenco',
                    error: error !== undefined
                }}
            />
            <FormControl
                margin="normal"
                fullWidth
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        castMembers.map((castMember, key) => (
                            <GridSelectedItem
                                key={key}
                                onDelete={ () => {
                                    removeItem(castMember)
                                }}
                                xs={6}>
                                <Typography noWrap={true}>
                                    {castMember.name}
                                </Typography>
                            </GridSelectedItem>
                        ))
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CastMemberField;