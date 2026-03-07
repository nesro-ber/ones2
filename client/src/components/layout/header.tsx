import { Bell, User as UserIcon, Shield, Settings, FileText } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import { useNotifications } from "@/hooks/use-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function Header() {
  const { role, setRole, user } = useAuth();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-6 backdrop-blur-md shadow-sm">
      <SidebarTrigger className="hover-elevate" />
      
      <div className="flex-1">
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher - For Demo Purposes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary">
              <Shield className="h-4 w-4" />
              <span className="capitalize font-semibold">{role} View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Changer de rôle</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRole('agent')}>Agent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('manager')}>Manager</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('hr')}>Ressources Humaines</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('admin')}>Administrateur</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 mt-2 rounded-xl p-0 overflow-hidden">
            <DropdownMenuLabel className="p-4 bg-slate-50 flex items-center justify-between">
              <span className="font-bold">Notifications</span>
              {unreadCount > 0 && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} nouvelles</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0" />
            <ScrollArea className="h-[350px]">
              {notifications && notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-primary/5' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold' : 'text-slate-600'}`}>
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            {formatDistanceToNow(new Date(n.createdAt!), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucune notification pour le moment</p>
                </div>
              )}
            </ScrollArea>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2 bg-slate-50 text-center">
              <Button variant="ghost" className="text-xs text-primary font-bold w-full h-8">Voir tout</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-[#ff9955] text-white font-semibold">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.department}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" /> Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" /> Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive gap-2">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
