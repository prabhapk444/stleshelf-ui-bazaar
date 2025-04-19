
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Try to create a profile for the new user
        if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          const { error } = await supabase
            .from('profiles')
            .upsert({ 
              id: session.user.id,
              email: session.user.email,
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'id' 
            });
            
          if (error) {
            console.error("Error updating profile:", error);
          }
        }
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Welcome to StyleShelf</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#404040',
                  brandAccent: '#171717',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            }
          }}
          theme="light"
          providers={["google","github"]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default AuthPage;
