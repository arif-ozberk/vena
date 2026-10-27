import React from 'react';

// Wrapper
import AuthWrapper from '../../wrappers/AuthWrapper';

const CalendarAppPage = () => {
    return (
        <AuthWrapper>
            <div className={`context-wrapper`}>
                <h1>Calendar App Page</h1>
            </div>
        </AuthWrapper>
    );
}

export default CalendarAppPage;