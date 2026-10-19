import vena_db from "./supabaseClient";


// Insert new user setting row to "user_settings" table after signing up for the first time
const addNewUserSetting = async (userSession) => {
    const { data, error } = await vena_db
        .from("user_settings")
        .insert([{ user_id: userSession.user.id, email: userSession.user.email, username: userSession.user.email.slice(0, 5) }])
    
    if (error) {
        return;
    }
}


// Check if the user setting row exists
const checkIfUserExist = async (userSession) => {
    const { data, error } = await vena_db
        .from("user_settings")
        .select()
        .eq("user_id", userSession.user.id)

    if (error) {
        console.log(error);
        return;
    }

    if (data.length === 0) {
        await addNewUserSetting(userSession);
        // location.reload();
        // console.log("Burası bozuk");
    }
}


// Fetch logged user data from "user_settings" table
const fetchUserData = async (userSession, setLoggedUserData) => {
    const { data: userSettingsData, error: userSettingsError } = await vena_db
        .from("user_settings")
        .select()
        .eq("user_id", userSession?.user.id)
        .single()

    if (userSettingsError) {
        console.error("Error fetching user data:", userSettingsError);
        return;
    }

    if (userSettingsData) {
        setLoggedUserData({
            user_settings: userSettingsData
        });
    }
}


// Update existing users data with new user input
const updateUserData = async (userSession, userInputChanges) => {

    const { data, error } = await vena_db
        .from("user_settings")
        .update(userInputChanges)
        .select()
        .eq("user_id", userSession?.user.id)

    if (error) {
        console.log(error);
        return;
    }

    if (data) {
        location.reload();
    }
}


const updateUserChanges = async (userSession, userInputChanges) => {

    const { data, error } = await vena_db
        .from("user_settings")
        .update(userInputChanges)
        .select()
        .eq("user_id", userSession?.user.id)

    if (error) {
        console.log(error);
        return;
    }

    if (data) {
        console.log(data);
    }
}


export default { checkIfUserExist, fetchUserData, updateUserData, updateUserChanges };