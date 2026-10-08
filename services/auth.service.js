const MarketMindAuthService = (() => {
  let client = null;

  const initialize = () => {
    const config = window.MARKETMIND_CONFIG?.supabase;

    if (!config?.url || !config?.publishableKey || !window.supabase) {
      return null;
    }

    if (!client) {
      client = window.supabase.createClient(config.url, config.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      window.MarketMindSupabase = client;
    }

    return client;
  };

  const getSession = async () => {
    const supabase = initialize();

    if (!supabase) {
      return {
        session: null,
        configured: false,
      };
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return {
      session: data.session,
      configured: true,
    };
  };

  const signUp = async (email, password) => {
    const supabase = initialize();

    if (!supabase) {
      throw new Error("Supabase authentication is not configured.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signIn = async (email, password) => {
    const supabase = initialize();

    if (!supabase) {
      throw new Error("Supabase authentication is not configured.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const supabase = initialize();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  const onAuthStateChange = (callback) => {
    const supabase = initialize();

    if (!supabase) {
      return {
        unsubscribe: () => {},
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return subscription;
  };

  initialize();

  return {
    initialize,
    getSession,
    signUp,
    signIn,
    signOut,
    onAuthStateChange,
  };
})();
