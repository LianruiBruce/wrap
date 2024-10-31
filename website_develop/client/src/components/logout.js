import { GoogleLogin, GoogleLogout } from 'react-google-login';

const clientId = "464749231636-aagjbq1nkp79885qj99v0reflb05ouf6.apps.googleusercontent.com"

function Logout(){
    const onSuccess = () => {
        console.log("Log out successfull!");
    }

    return(
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;