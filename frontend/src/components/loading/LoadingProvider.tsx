import * as React from 'react';
import LoadingContext from "./LoadingContext";
import axios from "axios";
import {useEffect, useMemo, useState} from "react";
import {
    addGlobalRequestInterceptor,
    addGlobalResponseInterceptor,
    removeGlobalRequestInterceptor, removeGlobalResponseInterceptor
} from "../../util/http";
import {omit} from 'lodash';

const LoadingProvider = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countRequest, setCountRequest] = useState(0);

    useMemo(() => {
        let isSubscribed = true;

        const requestIds = addGlobalRequestInterceptor((config) => {
            if (isSubscribed && !config.headers.hasOwnProperty('ignoreLoading')) {
                setLoading(true);
                setCountRequest((prevCountRequest) => prevCountRequest + 1)
            }
            config.headers = omit(config.headers, 'ignoreLoading');
            return config;
        });
        // forma antiga (que nao montava a ordem)
        // axios.interceptors.request.use((config) => {
        //     if (isSubscribed) {
        //         setLoading(true);
        //     }
        //     return config;
        // });

        const responseIds = addGlobalResponseInterceptor((config) => {
            if (isSubscribed) {
                decrementCountRequest();
            }
            return config;
            }, (error) => {
            if (isSubscribed) {
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