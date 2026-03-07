import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "./components/layout/app-layout";
import { Dashboard } from "./pages/dashboard";
import { RequestsPage } from "./pages/requests";
import { LeavesPage } from "./pages/leaves";
import { MissionsPage } from "./pages/missions";
import { FAQPage } from "./pages/faq";
import { UsersPage } from "./pages/users";
import { CalendarPage } from "./pages/calendar";
import { RecruitmentPage } from "./pages/recruitment";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/requests" component={RequestsPage}/>
        <Route path="/leaves" component={LeavesPage}/>
        <Route path="/missions" component={MissionsPage}/>
        <Route path="/faq" component={FAQPage}/>
        <Route path="/users" component={UsersPage}/>
        <Route path="/calendar" component={CalendarPage}/>
        <Route path="/recruitment" component={RecruitmentPage}/>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
