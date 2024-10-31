import { GoogleLogin } from 'react-google-login';

const clientId = "464749231636-aagjbq1nkp79885qj99v0reflb05ouf6.apps.googleusercontent.com"

function Login() {

    const onSuccess = (res) => {
        console.log("LOGIN SUCCESS!, Current user: ", res.profileObj);
    }

    const onFailure = (res) => {
        console.log("LOGIN Failed!, res: ", res);
    }
    return(
        <div id="signInButton">
            <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            />
        </div>
    )
}

export default Login;