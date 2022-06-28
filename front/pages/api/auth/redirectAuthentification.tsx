
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export function redirectAuthentification(gssp: GetServerSideProps) {
    return async (ctx: GetServerSidePropsContext) => {
        const {req} = ctx;
        const session = await getSession({req});
        
        if(session && session?.user?.authenticate == true) {
            return {
                redirect : {
                    permanent : false,
                    destination : "/mainpage",
                },
            };
        };
        return await gssp(ctx);
    }
}