import { createContext, useState } from "react";


export const UIContext = createContext({});


export const UIContextProvider = ({ children }) => {

    const [isNotificationsOn, setIsNotificationsOn] = useState(true);
    const [isDarkModeOn, setIsDarkModeOn] = useState(true);
    const [languageSelection, setLanguageSelection] = useState("English");


    return (
        <UIContext.Provider
            value={{
                isNotificationsOn, setIsNotificationsOn,
                isDarkModeOn, setIsDarkModeOn,
                languageSelection, setLanguageSelection
            }}
        >
            {children}
        </UIContext.Provider>
    );
}