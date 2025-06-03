import Link from 'next/link'
import React from 'react'
import Logo from '@/assets/logo.png'
import Image from 'next/image'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'
import { auth } from '@/utils/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/utils/auth'
const Navbar = async () => {

    const session=await auth()


    return (
        <nav className='flex items-center justify-between py-5'>
            <Link href={"/"} className='flex items-center gap-2'>
                <Image src={Logo} alt='logo_OpnHire' width={40} height={40} />
                <h1 className='text-2xl font-bold '>Opn<span className='text-primary'>Hire</span></h1>
            </Link>

            <div className='flex items-center gap-4'>
                <ThemeToggle />
                {
                    session?.user ? ( 
                        <form action={async ()=>{
                            "use server"
                            await signOut()
                            return redirect('/')
                        }}>
                            <Button className='text-white' >Logout</Button>
                        </form>
                ) : <Link className={buttonVariants({variant:'outline',size:'lg'})} href={'/login'}  >Login</Link>
                }
               
            </div>

        </nav>
    )
}

export default Navbar
