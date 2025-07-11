import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

export interface MenuItemProps {
    label: string
    icon: LucideIcon
    href: string
}

export function SideBarNavMenu({ items }: { items: MenuItemProps[] }) {
    return (
        <div>
            {
                items.length !== 0 && items.map((item) => (
                    <SidebarMenuItem key={item.label} className="list-none">
                        <SidebarMenuButton className="flex-nowrap" asChild>
                            <div>
                                <item.icon  className="size-4"/>
                               <Link href={item.href} className="flex items-center gap-3">
                                <span className="text-nowrap">{item.label}</span>
                              </Link>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                ))
            }
        </div>
    )
}
