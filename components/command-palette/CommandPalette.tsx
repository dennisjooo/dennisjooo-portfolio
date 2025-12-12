"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Home,
    User,
    Briefcase,
    FolderGit2,
    Cpu,
    Mail,
    Globe,
    Laptop,
    Moon,
    Sun,
    FileText
} from "lucide-react"
import { useTheme } from "next-themes"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { navItems } from "@/data/navbarContent"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        const openPalette = () => setOpen(true)

        document.addEventListener("keydown", down)
        document.addEventListener("openCommandPalette", openPalette)
        return () => {
            document.removeEventListener("keydown", down)
            document.removeEventListener("openCommandPalette", openPalette)
        }
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="max-h-[300px] overflow-hidden">
                <ScrollArea className="h-[300px]">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        {navItems.map((item) => {
                            const Icon = getIconForId(item.id)
                            return (
                                <CommandItem
                                    key={item.id}
                                    value={item.label}
                                    onSelect={() => runCommand(() => {
                                        if (item.href) {
                                            router.push(item.href)
                                        } else {
                                            router.push(`/#${item.id}`)
                                        }
                                    })}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}

function getIconForId(id: string) {
    switch (id) {
        case 'home': return Home
        case 'about': return User
        case 'work': return Briefcase
        case 'projects': return FolderGit2
        case 'skills': return Cpu
        case 'contact': return Mail
        case 'blogs': return FileText
        default: return Globe
    }
}
