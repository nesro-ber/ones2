import { 
  Home, FileText, Briefcase, Calendar, MessageSquare, 
  Users, Settings, HelpCircle, UserPlus, Palmtree, User
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/use-auth";
import logoPng from "@assets/Sonatrach_(1)_1772795537787.png";

export function AppSidebar() {
  const [location] = useLocation();
  const { role } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { title: "Tableau de Bord", url: "/", icon: Home },
    ];

    switch(role) {
      case 'agent':
        return [
          ...baseItems,
          { title: "Mon Profil", url: "/profile", icon: User },
          { title: "Mes Missions", url: "/missions", icon: Briefcase },
          { title: "Congés", url: "/leaves", icon: Palmtree },
          { title: "Demandes & Documents", url: "/requests", icon: FileText },
          { title: "Calendrier", url: "/calendar", icon: Calendar },
          { title: "Chatbot & FAQ", url: "/faq", icon: MessageSquare },
        ];
      case 'manager':
        return [
          ...baseItems,
          { title: "Mon Profil", url: "/profile", icon: User },
          { title: "Calendrier Équipe", url: "/calendar", icon: Calendar },
          { title: "Validation Demandes", url: "/requests", icon: FileText },
          { title: "Rapports Missions", url: "/missions", icon: Briefcase },
        ];
      case 'hr':
        return [
          ...baseItems,
          { title: "Mon Profil", url: "/profile", icon: User },
          { title: "Gestion Demandes", url: "/requests", icon: FileText },
          { title: "Recrutement", url: "/recruitment", icon: UserPlus },
          { title: "Calendrier Global", url: "/calendar", icon: Calendar },
          { title: "Historique & Logs", url: "/history", icon: FileText },
          { title: "Répondre FAQ", url: "/faq", icon: HelpCircle },
        ];
      case 'admin':
        return [
          ...baseItems,
          { title: "Gestion Employés", url: "/users", icon: Users },
          { title: "Gestion FAQ", url: "/faq", icon: Settings },
          { title: "Paramètres Système", url: "/settings", icon: Settings },
        ];
      default: return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img src={logoPng} alt="Sonatrach" className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight text-foreground">Portail RH</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-[#FF6600]">Sonatrach</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-6">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className={`
                      rounded-lg transition-all duration-200 h-11
                      ${isActive 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-sidebar-foreground hover:bg-slate-100 hover:text-foreground'}
                    `}>
                      <Link href={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
