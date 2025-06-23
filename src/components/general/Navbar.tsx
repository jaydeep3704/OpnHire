import Link from 'next/link'
import React from 'react'
import Logo from '@/assets/logo.png'
import Image from 'next/image'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'
import { auth } from '@/utils/auth'
import UserDropDown from './UserDropDown'


const Navbar = async () => {

    const session=await auth()


    return (
        <nav className='flex items-center justify-between py-5'>
            <Link href={"/"} className='flex items-center gap-2'>
                <Image src={Logo} alt='logo_OpnHire' width={40} height={40} />
                <h1 className='text-2xl font-bold '>Opn<span className='text-primary'>Hire</span></h1>
            </Link>

            <div className='flex items-center gap-5'>
                <ThemeToggle/>
                 <Link href={"/post-job"} className={buttonVariants({size:'lg'})}>Post Job</Link>
                {
                    session?.user? <UserDropDown/> : (
                        <Link href={'/login'} className={buttonVariants({variant:"outline",size:"lg"})} prefetch={true}>
                            Login
                        </Link>
                    )
                }
            </div>

        </nav>
    )
}

export default Navbar
