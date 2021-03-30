import * as React from 'react';
import {
    Button,
    FormControl,
    FormControlProps,
    FormHelperText
} from "@material-ui/core";
import InputFile, {InputFileComponent} from "../../../components/InputFile";
import CloudUploadFile from "@material-ui/icons/CloudUpload";
import {MutableRefObject, useRef} from "react";

interface UploadFieldProps {
    accept: string,
    label: string,
    setValue: (value) => void,
    error?: any
    disabled?: boolean,
    FormControlProps?: FormControlProps
}

const UploadField: React.FC<UploadFieldProps> = (props) => {
    const fileRef = useRef() as MutableRefObject<InputFileComponent>;

    const {accept, label, setValue, error, disabled} = props;

    return (
        <FormControl
            margin="normal"
            error={error !== undefined}
            disabled={disabled === true}
            fullWidth
            {...props.FormControlProps}
        >
            <InputFile
                ref={fileRef}
                TextFieldsProps={{
                    label: label,
                    InputLabelProps: {shrink: true},
                    style: {backgroundColor: "#ffffff"}
                }}
                InputFileProps={{
                    accept,
                    onChange(event) {
                        const files = event.target.files as any;
                        files.length && setValue(files[0])
                    }
                }}
                ButtonFile={
                    <Button
                        endIcon={<CloudUploadFile />}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => fileRef.current.openWindow()}
                    >
                        Adicionar
                    </Button>
                }
            />
            {
                error && <FormHelperText>{error.message}</FormHelperText>
            }
        </FormControl>
    );
};

export default UploadField;