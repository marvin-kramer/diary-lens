import React, {ReactNode} from 'react';
import SupabaseAccessClientHelper, {SupabaseAccessData} from "@/components/providers/supabase-access-client-helper";

const SupabaseAccessProvider = ({children}:{children: ReactNode}) => {

    const supabaseAccessData: SupabaseAccessData = {
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_ANON_KEY!,
    }

    return (
        <SupabaseAccessClientHelper supabaseAccessData={supabaseAccessData}>
            {children}
        </SupabaseAccessClientHelper>
    );
};

export default SupabaseAccessProvider;