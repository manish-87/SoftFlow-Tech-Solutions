import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import BlogPage from "@/pages/blog-page";
import BlogDetailPage from "@/pages/blog-detail-page";
import CareersPage from "@/pages/careers-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import Dashboard from "@/pages/admin/dashboard";
import BlogManagement from "@/pages/admin/blog-management";
import Messages from "@/pages/admin/messages";
import Partners from "@/pages/admin/partners";
import Careers from "@/pages/admin/careers";
import Services from "@/pages/admin/services";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import WhatsappButton from "./components/whatsapp-button";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services">
        {() => <Redirect to="/contact?service=true" />}
      </Route>
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* User Dashboard - Protected route for authenticated users */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />

      {/* Admin Routes - Protected with admin only access */}
      <ProtectedRoute path="/admin" component={Dashboard} adminOnly />
      <ProtectedRoute path="/admin/blog" component={BlogManagement} adminOnly />
      <ProtectedRoute path="/admin/messages" component={Messages} adminOnly />
      <ProtectedRoute path="/admin/partners" component={Partners} adminOnly />
      <ProtectedRoute path="/admin/careers" component={Careers} adminOnly />
      <ProtectedRoute path="/admin/services" component={Services} adminOnly />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
        <WhatsappButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
