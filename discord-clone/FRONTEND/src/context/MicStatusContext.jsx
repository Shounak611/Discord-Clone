import { createContext, useContext, useState } from 'react';

const MicStatusContext = createContext();

export function MicStatusProvider({ children }) {
    const [micOn, setMicOn] = useState(false);
    return (
        <MicStatusContext.Provider value={{ micOn, setMicOn }}>
            {children}
        </MicStatusContext.Provider>
    );
}

export function useMicStatus() {
    return useContext(MicStatusContext);
}
