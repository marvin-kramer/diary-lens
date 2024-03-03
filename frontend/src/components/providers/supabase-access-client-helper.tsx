"use client"
import React, {createContext, ReactNode} from 'react';

export type SupabaseAccessData = {
    supabaseUrl: string,
    supabaseKey: string,
}

type Props = {
    children: ReactNode
    supabaseAccessData: SupabaseAccessData
}

export const SupabaseAccessContext = createContext<SupabaseAccessData | null>(null)

const SupabaseAccessClientHelper = ({children, supabaseAccessData}:Props) => {
    return (
        <SupabaseAccessContext.Provider value={supabaseAccessData}>
            {children}
        </SupabaseAccessContext.Provider>
    );
};

export default SupabaseAccessClientHelper;