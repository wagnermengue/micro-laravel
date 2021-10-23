import {useSnackbar} from "notistack";
import axios from "axios";
import {useCallback} from "react";

const useHttpHandle = () => {
    const {enqueueSnackbar} = useSnackbar();
    return useCallback(async (request: Promise<any>) => {
        try {
            const {data} = await request;
            return data;
        } catch (e) {
            console.log(e);
            if (! axios.isCancel(e)) {
                enqueueSnackbar(
                    "Não foi possivel carregar as informações",
                    {variant: "error"}
                );
            }
            throw e;
        }
    },[enqueueSnackbar]);
};

export default useHttpHandle;