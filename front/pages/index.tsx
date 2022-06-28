import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Index.module.css'
import Homepage from './homepage/homepage'
import Gamepage from './gamepage'
import MainPage from './mainpage'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loginpage from './loginpage'
import Registerpage from './registerpage'
import Login from './login/login'
import { useSession } from 'next-auth/react'
import  Router  from 'next/router'
import { requireAuthentification } from './api/auth/requireAuthentification'
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const Index: NextPage = () => {
	
  const {data : session} = useSession();
  return (<MainPage component={<Homepage/>}/>);

}

export default Index;

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );