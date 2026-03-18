import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardCampaigns from "./pages/DashboardCampaigns";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardAttribution from "./pages/DashboardAttribution";
import DashboardAnalytics from "./pages/DashboardAnalytics";
import DashboardOrbitalPage from "./pages/DashboardOrbital";
import DashboardLinks from "./pages/DashboardLinks";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/campaigns"} component={DashboardCampaigns} />
      <Route path={"/users"} component={DashboardUsers} />
      <Route path={"/attribution"} component={DashboardAttribution} />
      <Route path={"/analytics"} component={DashboardAnalytics} />
      <Route path={"/orbital"} component={DashboardOrbitalPage} />
      <Route path={"/links"} component={DashboardLinks} />
      <Route path={"/campaign/:campaignId"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
