
import React from 'react';

class SignINPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMessage: ''
        }
    }


    connect() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "username": this.state.username, "password":  this.state.password});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/signin", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.succes === false) {
                    console.log("oups");
                    this.setState({errorMessage:result.message})
                }else{
                    // connected
                    console.log(result);
                    localStorage.setItem('token',result.token);
                    this.props.history.push('/home');
                }
            })
            .catch(error => console.log('error', error));
    }


    render() {
        return (
            <div>
                <div class="container">

                    <div class="row justify-content-center">

                        <div class="col-xl-10 col-lg-12 col-md-9">

                            <div class="card o-hidden border-0 shadow-lg my-5">
                                <div class="card-body p-0">
                                    <div class="row">
                                        <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                        <div class="col-lg-6">
                                            <div class="p-5">
                                                <div class="text-center">
                                                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                </div>
                                                <form class="user" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    this.connect();


                                                }}  >
                                                    <div class="form-group">
                                                        <input
                                                            onChange={(e) => { this.setState({ username: e.target.value }) }}

                                                            type="text" class="form-control form-control-user"
                                                            id="exampleInputEmail" aria-describedby="emailHelp"
                                                            placeholder="Enter Email Address..." />
                                                    </div>
                                                    <div class="form-group">
                                                        <input
                                                            onChange={(e) => { this.setState({ password: e.target.value }) }}

                                                            type="password" class="form-control form-control-user"
                                                            id="exampleInputPassword" placeholder="Password" />
                                                    </div>

                                                    <button type="submit" class="btn btn-primary btn-user btn-block">
                                                        Login
                                                    </button>

                                                    {
                                                        this.state.errorMessage !== '' ?
                                                            <div className="mt-3 alert alert-danger">
                                                                {this.state.errorMessage}
                                                            </div>
                                                            :
                                                            <div></div>
                                                    }

                                                </form>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default SignINPage;
