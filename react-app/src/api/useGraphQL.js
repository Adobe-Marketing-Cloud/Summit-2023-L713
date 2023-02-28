/*
Copyright 2020 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import {useState, useEffect} from 'react';
const {AEMHeadless} = require('@adobe/aem-headless-client-js')
const {REACT_APP_GRAPHQL_ENDPOINT, REACT_APP_HOST_URI, REACT_APP_SERVICE_TOKEN} = process.env;

/**
 * Custom React Hook to perform a GraphQL query
 * @param query - GraphQL query
 * @param path - Persistent query path
 * @param params - GraphQL query parameters
 */
function useGraphQL(query, path, params) {
    let [data, setData] = useState(null);
    let [errorMessage, setErrors] = useState(null);
    useEffect(() => {
        function makeRequest() {
            const sdk = new AEMHeadless({
                serviceURL: REACT_APP_HOST_URI,
                auth: REACT_APP_SERVICE_TOKEN,
                endpoint: REACT_APP_GRAPHQL_ENDPOINT,
            });
            const request = query ? sdk.runQuery.bind(sdk) : sdk.runPersistedQuery.bind(sdk);
    
            request(path, params)
                .then(({data, errors}) => {
                    //If there are errors in the response set the error message
                    if (errors) {
                        setErrors(mapErrors(errors));
                    }
                    //If data in the response set the data as the results
                    if (data) {
                        setData(data);
                    }
                })
                .catch((error) => {
                    setErrors(error);
                    sessionStorage.removeItem('accessToken');
                });
        }
        makeRequest();
    }, [query, path, params]);

    

    return {data, errorMessage}
}

/**
 * concatenate error messages into a single string.
 * @param {*} errors
 */
function mapErrors(errors) {
    return errors.map((error) => error.message).join(",");
}

export default useGraphQL;