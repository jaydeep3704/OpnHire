import Link from "next/link"
import Image from "next/image"
import Logo from "@/assets/logo.png"
import LoginForm from "@/components/forms/LoginForm"
const page = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href={"/"} className="flex gap-2 items-center self-center">
               <Image src={Logo} alt="opn-hire-logo" className="size-10"/>
               <h1 className="text-2xl font-bold">
                  Opn<span className="text-primary">Hire</span>
               </h1>
            </Link>
            <LoginForm/>
        </div>
    </div>
  )
}

export default page
