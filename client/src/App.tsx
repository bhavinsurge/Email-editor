import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import EmailBuilderPage from "@/pages/email-builder";
import CustomEmailBuilderPage from "@/pages/custom-email-builder";
import SimpleBuilderPage from "./pages/simple - builder";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleBuilderPage} />
      <Route path="/email-builder" component={EmailBuilderPage} />
      <Route path="/custom-email-builder" component={CustomEmailBuilderPage} />
      <Route path="/simple-builder" component={SimpleBuilderPage} />
      <Route component={NotFound} />
    </Switch>
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
