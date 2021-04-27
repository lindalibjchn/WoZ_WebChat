import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
    <div className="textContainer">
            users
                ? (
                    <div>
                        <h5>Realtime Chatting List <span role="img" aria-label="emoji">💬</span></h5>
                        <div className="activeContainer">
                            <h4>
                                {users.map(({name}) => (
                                    <div key={name} className="activeItem">
                                        {name}
                                        <img alt="Online Icon" src={onlineIcon}/>
                                    </div>
                                ))}
                            </h4>
                        </div>
                    </div>
                )
                : null
        }
    </div>
);

export default TextContainer;