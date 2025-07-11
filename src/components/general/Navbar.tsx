import Link from 'next/link'
import React from 'react'
import Logo from '@/assets/logo.png'
import Image from 'next/image'
import {  buttonVariants } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'
import { auth } from '@/utils/auth'
import UserDropDown from './UserDropDown'
import { cn } from '@/lib/utils'
import { prisma } from '@/utils/db'
import { getCurrentUser } from '@/utils/currentUser'
import { SidebarTrigger } from '../ui/sidebar'



const Navbar = async () => {

    const user=await getCurrentUser({redirectOnFail:false})
    
    return (
       <> 
        <nav className='flex items-center justify-between py-5 max-w-7xl mx-auto '>
            
            <Link href={"/"} className='flex items-center gap-2'>
                <SidebarTrigger className='md:hidden'/>
                {/* <Image src={Logo} alt='logo_OpnHire' width={40} height={40} className='size-8 md:size-10 '/> */}
                <h1 className='text-xl md:text-2xl font-bold '>Opn<span className='text-primary'>Hire</span></h1>
            </Link>

            <div className='flex items-center gap-5'>
                <ThemeToggle/>
                {user &&user.userType!=="JOB_SEEKER" && <Link href={"/post-job"} className={ cn( buttonVariants({size:'lg'}),"hidden lg:flex")}>Post Job</Link>}
                {
                    !user && 
                        <Link href={'/login'} className={buttonVariants({variant:"outline",size:"lg"})} prefetch={true}>
                            Login
                        </Link>
                    
                }
            </div>

        </nav>
                
       </> 
    )
}

export default Navbar
