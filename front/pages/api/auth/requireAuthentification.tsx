import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import axios from 'axios'

export function requireAuthentification(gssp: GetServerSideProps) {
    return async (ctx: GetServerSidePropsContext) => {
        const {req} = ctx;
        const session = await getSession({req});
        const id = session?.user?.id;
        let user: any = null;

        if (id)
            user = await axios.post("http://back:4000/user/requestUser", {id: id})

        if(!session || session?.user?.authenticate == false || !user) {
            return {
                redirect : {
                    permanent : false,
                    destination : "/loginpage",
                },
            };
        }
        return await gssp(ctx);
    };
}
