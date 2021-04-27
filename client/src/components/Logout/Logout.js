import React, {Component, useEffect, useRef} from "react";
import 'whatwg-fetch'
import '../Join/Join.css'

//customer function
import {deleteStorage, getFromStorage, setInStorage} from "../../utils/storage";
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from "react-bootstrap";
import beerbot from "../../icons/beerbot.jpg";
import io from "socket.io-client";
import {ENDPOINT} from "../../utils/storage";

let socket
socket = io(ENDPOINT);

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state={
            isLoading: true,
            token: '',
            nickName:''
        };

        this.logout = this.logout.bind(this);
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

       this.logout()
    }

    logout(){

        socket.current = io.connect(ENDPOINT);

        this.setState({
            isLoading: true
        })

        const obj = getFromStorage('user_token');
        const obj_userid = getFromStorage('user_id');

        deleteStorage('user_name');


        if(obj && obj.token){
            const { token } = obj;
            const { user_id } = obj_userid;

            fetch(ENDPOINT + '/api/account/logout?token='+token+ '&userid=' + user_id)
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    if(json.success){
                        this.setState({
                            token: '',
                            isLoading: false,
                            nickName: json.nickName
                        });
                    } else{
                        this.setState({
                            isLoading:false
                        })
                    }
                });
        }else{
            this.setState({
                isLoading: false,
            });
        }
    }

    render() {
        const {
            isLoading,
            nickName
        } = this.state

        if (isLoading){
            return(<div><p>Loading...</p></div>)
        }

        return(
            <div>
                <Alert variant='success'>
                    <Alert.Heading> Well Done! </Alert.Heading>
                    <p>
                    Thank user: {nickName} for participating this experiment, plase click {' '}
                    <Alert.Link href="https://forms.gle/kTt3m2jV1AUyfqC96">this survey link</Alert.Link> and answer questions about this expeirment.
                    </p>
                    <img className="imgbye" src={beerbot}/>
                </Alert>
            </div>
        )
    }

}

export default Logout;