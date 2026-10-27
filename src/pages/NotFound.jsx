import React, { useContext, useEffect } from 'react';

// Context
import { UIContext } from '../context/UIContext';

// Functions
import { setTabName } from '../functions/SetTabName';


const NotFound = () => {

    const { setCurrentPage } = useContext(UIContext);


    useEffect(() => {
        setTabName(setCurrentPage);
    }, [])

    
    return (
        <div>Not Found</div>
    );
}

export default NotFound;