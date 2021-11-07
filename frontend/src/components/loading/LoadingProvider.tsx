import * as React from 'react';
import LoadingContext from "./LoadingContext";
import {useEffect, useMemo, useState} from "react";
import {
    addGlobalRequestInterceptor,
    addGlobalResponseInterceptor,
    removeGlobalRequestInterceptor, removeGlobalResponseInterceptor
} from "../../util/http";

const LoadingProvider = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countRequest, setCountRequest] = useState(0);

    useMemo(() => {
        let isSubscribed = true;

        const requestIds = addGlobalRequestInterceptor((config) => {
            if (isSubscribed && !config.headers.hasOwnProperty('x-ignore-loading')) {
                setLoading(true);
                setCountRequest((prevCountRequest) => prevCountRequest + 1)
            }
            return config;
        });
        // forma antiga (que nao montava a ordem)
        // axios.interceptors.request.use((config) => {
        //     if (isSubscribed) {
        //         setLoading(true);
        //     }
        //     return config;
        // });

        const responseIds = addGlobalResponseInterceptor((response) => {
            if (isSubscribed && !response.config.headers.hasOwnProperty('x-ignore-loading')) {
                decrementCountRequest();
            }
            return response;
            }, (error) => {
            if (isSubscribed && !error.config.headers.hasOwnProperty('x-ignore-loading')) {
                decrementCountRequest();
            }
            return Promise.reject(error);
        });

        function decrementCountRequest() {
            setCountRequest((prevCountRequest) => prevCountRequest - 1)
        }

        // forma antiga (que nao montava a ordem)
        // axios.interceptors.response.use((config) => {
        //     if (isSubscribed) {
        //         setLoading(false);
        //     }
        //     return config;
        // }, (error) => {
        //     if (isSubscribed) {
        //         setLoading(false);
        //     }
        //     return Promise.reject(error);
        // });

        return () => {
            isSubscribed = false;
            removeGlobalRequestInterceptor(requestIds);
            removeGlobalResponseInterceptor(responseIds);
        }
    }, [true]);

    useEffect(() => {
        if (!countRequest) {
            setLoading(false);
        }
    }, [countRequest])

    return (
        <LoadingContext.Provider value={loading}>
            {props.children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;