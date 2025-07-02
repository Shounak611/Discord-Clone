import { createContext, useContext, useState } from 'react';

const MicStatusContext = createContext();

export function MicStatusProvider({ children }) {
    const [micOn, setMicOn] = useState(false);
    const [micTrack, setMicTrack] = useState(null);
    return (
        <MicStatusContext.Provider value={{ micOn, setMicOn, micTrack, setMicTrack }}>
            {children}
        </MicStatusContext.Provider>
    );
}

export function useMicStatus() {
    return useContext(MicStatusContext);
}
