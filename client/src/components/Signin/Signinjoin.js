import React, {Component, useState} from "react";
import {useHistory} from "react-router-dom";

import 'whatwg-fetch'
import {Image, Alert, Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import head from '../Head/Head';

import './Signin.css'
import siginwelcome from '../../icons/signinwelcome.jpg';

//customer function
import {getFromStorage, setInStorage} from "../../utils/storage";
import {Link} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {ENDPOINT} from "../../utils/storage";

// const ENDPOINT = 'http://localhost:5000'; //dev
class Signinjoin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            signInError: '',
            masterError: '',
            signInEmail: '',
            signInPassword: '',
            getNickname: '',
            room: '1',
            token: ''
        };

        this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
        this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
        this.onTextboxChangeRoom = this.onTextboxChangeRoom.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
    }

    componentDidMount() {

        //verify if has a user account login already and login automatically
        const obj = getFromStorage('user_token');

        if (obj && obj.token) {
            const {token} = obj;

            //verify token by fetch user collection from db
            fetch(ENDPOINT + '/api/account/userverify?token=' + token
            ).then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        })
                    }
                });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    onTextboxChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value,
        })
    }

    onTextboxChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value,
        })
    }

    onTextboxChangeRoom(event) {
        this.setState({
            room: event.target.value,
        })
    }

    onSignIn() {
        //grab state
        const {
            signInEmail,
            signInPassword,
            getNickname,
            room
        } = this.state;

        this.setState({
            isLoading: true,
        })
        //post request to backup
        fetch(ENDPOINT + '/api/account/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword
            })
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    setInStorage('user_token', {token: json.token});
                    setInStorage('user_id', {user_id: json.user_id})
                    setInStorage('user_name', {nickName: json.nickName})
                    this.setState(
                        {
                            signInError: json.message,
                            isLoading: false,
                            signInEmail: '',
                            signInPassword: '',
                            token: json.token,
                            getNickname: json.nickName
                        });
                } else {
                    this.setState(
                        {
                            signInError: json.message,
                            isLoading: false
                        });
                }
            });

    }

    render() {
        const {
            isLoading,
            token,
            signInError,
            signInPassword,
            signInEmail,
            getNickname,
            room
        } = this.state

        const name = getNickname;

        if (isLoading) {
            return (<div><p>Loading...</p></div>)
        }
        if (!getNickname) {
            return (
                <div className="signinOuterContainer">
                    <div className="signinInnerContainer">
                        {
                            (signInError) ? (<p>{signInError}</p>) : null
                        }
                        <div><p>{getNickname}</p></div>
                        <h1 className="heading">Sign In</h1>
                        <input type="email" placeholder="email" className="signinInput"
                               value={signInEmail}
                               onChange={this.onTextboxChangeSignInEmail}/>
                        <input type="password" placeholder="password" className="signinInput"
                               value={signInPassword}
                               onChange={this.onTextboxChangeSignInPassword}/>
                        <input placeholder="Room"
                               className="signinInput"
                               type="text"
                               onChange={this.onTestboxChangeRoom}/>
                        <button className="signinbutton mt-20" type="submit" onClick={this.onSignIn}>Sign In</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>

                    <Alert variant='primary'>
                        <Alert.Heading> Welcome {name}, Let us have a Chat with {' '}
                            <Alert.Link href="#"><Link to={`chat?name=${name}&room=${room}` }>This
                                Link</Link></Alert.Link> Go to Chat Room.</Alert.Heading>
                        <img className="imgwelcome" src={siginwelcome}/>
                    </Alert>
                </div>
            )
        }
    }
}

export default Signinjoin;