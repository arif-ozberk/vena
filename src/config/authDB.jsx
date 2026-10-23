import vena_db from "./supabaseClient";
import userSettingsDB from "./userSettingsDB";


// Function to check if user is logged in and get it's session data
const getSession = async (setIsAuthenticated, setUserSession, setIsSessionLoading, setLoggedUserData) => {
    const {
        data: { session }
    } = await vena_db.auth.getSession();

    // setIsAuthenticated(session === null ? false : true);
    setIsAuthenticated(session !== null);

    // setUserSession(session);
    // userSettingsDB.checkIfUserExist(session);
    // userSettingsDB.fetchUserData(session, setLoggedUserData);
    if (session) {
        // Wait until we verify the user exists (or finishes inserting)
        await userSettingsDB.checkIfUserExist(session);
        // Now safely fetch the user data
        await userSettingsDB.fetchUserData(session, setLoggedUserData);
    }
    
    setIsSessionLoading(false);
};


// Function to check if user is logged in
const checkSession = async (setIsLoggedIn, setUsername) => {
    const {
        data: { session }
    } = await vena_db.auth.getSession();

    if (session) {
        const { data, error } = await vena_db
            .from("user_settings")
            .select("username")
            .eq("user_id", session.user.id)
            .single()

        if (error) {
            console.log(error);
            return;
        }

        if (data) {
            setIsLoggedIn(true);
            setUsername(data.username);
        }
    }

    else {
        setIsLoggedIn(false);
        setUsername(null);
    }
};


// Sign Out funtionality
const handleSignOut = async (setUserSession, setIsAuthenticated, setIsSessionLoading, setLoggedUserData) => {
    try {
        const { data: sessionData } = await vena_db.auth.getSession();
        if (!sessionData.session) {
            console.warn("No session found — skipping logout request");
            return;
        }

        const { error } = await vena_db.auth.signOut();
        if (error) throw error;

        setUserSession(null);
        setIsAuthenticated(false);
        setIsSessionLoading(true);
        setLoggedUserData(null);
        location.reload();
    } catch (err) {
        console.error("Logout error:", err.message);
    }
};


export default { getSession, checkSession, handleSignOut }