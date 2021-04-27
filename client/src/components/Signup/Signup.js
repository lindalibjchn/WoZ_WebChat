import React, { Component,useState } from "react";
import 'whatwg-fetch'
import {Dropdown, Form, Alert, FormCheck, Modal, Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css'
import '../Informdoc/Informdoc';


//customer function
import {getFromStorage, setInStorage} from "../../utils/storage";
import {Link} from "react-router-dom";
import signupwelcome from "../../icons/robot-vs-human.jpg";

import Informdoc from "../Informdoc/Informdoc";
import Messages from "../Messages/Messages";
import {ENDPOINT} from "../../utils/storage";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state={
            isLoading: true,
            signUpError: '',
            masterError: '',
            signUpPassword:'',
            signUpNickName: '',
            signUpEmail:'',
            signUpAgegroup: '',
            signUpGender:'',
            signUpReadInfo: true,
            modalShow:false,
            handleClose:false

        };

        // this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
        this.onTextboxChangeSignUpNickName = this.onTextboxChangeSignUpNickName.bind(this);
        this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
        this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
        this.onSignup = this.onSignup.bind(this);
        this.onSelectItemChangeAgegroup = this.onSelectItemChangeAgegroup.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onCheckboxReadExperimentInofr = this.onCheckboxReadExperimentInofr.bind(this);
        this.onSelectItemChangeGender = this.onSelectItemChangeGender.bind(this);
    }

    componentDidMount() {

        //verify if has a user account login already and login automatically
        const obj = getFromStorage('user_token');

        if(obj && obj.token){
            const { token } = obj;

            //verify token by fetch user collection from db
            fetch(ENDPOINT+'/api/account/userverify?token='+token)
                .then(res => res.json())
                .then(json => {
                    if(json.success){
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else{
                        this.setState({
                            isLoading:false
                        })
                    }
                });
        }else {
            this.setState({
                isLoading: false,
            });
        }
    }

    onTextboxChangeSignUpNickName(event)
    {
        this.setState({
            signUpNickName: event.target.value,
        })
    }

    onTextboxChangeSignUpLastName(event)
    {
        this.setState({
            signUpLastName: event.target.value,
        })
    }

    onTextboxChangeSignUpEmail(event)
    {
        this.setState({
            signUpEmail: event.target.value,
        })
    }

    onTextboxChangeSignUpPassword(event)
    {
        this.setState({
            signUpPassword: event.target.value,
        })
    }

    onSelectItemChangeAgegroup(event)
    {
        this.setState({
            signUpAgegroup: event.target.value,
        })

        console.log("selectitem", event.target.value)
    }

    onSelectItemChangeGender(event)
    {
        this.setState(
            {
                signUpGender: event.target.value,
            }
        )
    }

    togglePopup(){
        this.setState(
            {
                signUpAgree: !this.state.signUpAgegroup
            }
        )
    }

    onHide(){
        this.setState(
            {
                modalShow:false
            }
        )
        // return false
    }

    onCheckboxReadExperimentInofr()
    {
        //grab state
        console.log(document.getElementById("readinfor").checked);
        this.setState({
            // isLoading:true,
            signUpReadInfo:document.getElementById("readinfor").checked,
        })
    }

    onSignup()
    {
        //grab state
        const{
            signUpNickName,
            signUpEmail,
            signUpPassword,
            signUpAgegroup,
            signUpReadInfo,
            signUpGender,
            modalShow,
        } = this.state;


        if(!document.getElementById("readinfor").checked){
            alert('Please read the experiment information, or you cannot signup this experiment.')
        } else {

            this.setState({
                isLoading:true,
                signUpEmail:document.getElementById("emailid").value,
                modalShow:true,
            })

            //post request to backup
            fetch(ENDPOINT + '/api/account/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nickName: signUpNickName,
                    email: signUpEmail,
                    password: signUpPassword,
                    agegroup: signUpAgegroup,
                    gender: signUpGender,
                    agree: signUpReadInfo
                })
            }).then(res => res.json())
                .then(json => {
                    if (json.success) {

                        this.setState(
                            {
                                signUpError: json.message,
                                isLoading: false,
                                signUpPassword: '',
                                signUpGender: '',
                                signUpAgegroup: '',
                                signUpReadInfo: false
                            });
                    } else {
                        this.setState(
                            {
                                signUpError: json.message,
                                isLoading: false
                            });
                    }
                });
        }
    }

    render() {
        const {
            isLoading,
            signUpError,
            signUpNickName,
            signUpEmail,
            signUpPassword,
            signUpAgegroup,
            signUpReadInfo,
            signUpGender,
            modalShow
        } = this.state

        if (isLoading){
            return(<div><p>Loading...</p></div>)
        }

        if(modalShow){
            return (
                <Modal
                    show={modalShow}
                    onHide={() => this.onHide(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            User Consent
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Informdoc inform="consent" emailid={signUpEmail}></Informdoc>
                    </Modal.Body>
                </Modal>
            )
        }

        if (signUpError === '') {
            return (
                <div className="signupOuterContainer">
                    <div className="signupInnerContainer">
                        {
                            (signUpError) ? (<p>{signUpError}</p>) : null
                        }
                        <h1 className="heading">Sign Up</h1>
                        <input type="text" placeholder="Nickname" className="signupInput"
                               value={signUpNickName}
                               onChange={this.onTextboxChangeSignUpNickName}/>
                        <input type="email" placeholder="email" id = "emailid"  className="signupInput"
                               value={signUpEmail}
                               onChange={this.onTextboxChangeSignUpEmail}
                        />
                        <Form.Control
                        as="select"
                        size="sm"
                        custom
                        onChange={this.onSelectItemChangeGender}
                        ref={signUpGender}
                        >
                        <option value="">Select Gender</option>
                        <option value="0">Female</option>
                        <option value="1">Male</option>
                        <option value="2">Prefer not to disclose</option>
                        </Form.Control>

                        <Form.Control
                            as="select"
                            size="sm"
                            custom
                            onChange={this.onSelectItemChangeAgegroup}
                            ref={signUpAgegroup}
                        >
                            <option value="">Select Age Group</option>
                            <option value="0">18-24</option>
                            <option value="1">25-44</option>
                            <option value="2">45-59</option>
                            <option value="3">60+</option>
                        </Form.Control>

                        <input type="password" placeholder="password" className="signupInput"
                               value={signUpPassword}
                               onChange={this.onTextboxChangeSignUpPassword}/>
                        <div style={{float:"left"}}>
                            <input type="checkbox" style={{color:"white", float:"innerHeight" }} id = "readinfor" onChange={this.onCheckboxReadExperimentInofr} />
                            <span style={{color:"white", float:"innerHeight", margin: 10}}>I have read the experiment information.</span>
                        </div>
                        <button className="signupbutton mt-20" type="submit" onClick={this.onSignup}>Sign up</button>
                    </div>
                </div>
            )
        }
        else if (signUpError == 'Signed up') {
            return (
                <div>
                    <Alert variant='primary'>
                        <Alert.Heading> Register Successfully </Alert.Heading>
                        <p>
                            Welcome {signUpNickName}, Click {' '}
                            <Alert.Link href="/">This Link</Alert.Link> Please Sign In.
                        </p>
                        <img className="imgwelcome" src={signupwelcome}/>
                    </Alert>
                </div>
            )
        } else{
            return (
                <div>
                    <Alert variant='warning'>
                        {signUpError} hoops! register faild, please contact your admin
                    </Alert>
                    {/*<h3>{signUpError} hoops! register faild, please contact your admin</h3>*/}
                </div>
            )
        }
    }

};

export default Signup;