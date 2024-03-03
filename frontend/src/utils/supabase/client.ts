import {createBrowserClient} from "@supabase/ssr";
import {useContext} from "react";
import {SupabaseAccessContext} from "@/components/providers/supabase-access-client-helper";

export const useCreateClient = () => {
    const context = useContext(SupabaseAccessContext)
    return createBrowserClient(
        context!.supabaseUrl,
        context!.supabaseKey
    );
}
