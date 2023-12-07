import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const ErrorHandler = ({ error }) => {
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    if (errorMessage) {
        return <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>{errorMessage}</Alert>
    }

    return null;
};

export default ErrorHandler;
