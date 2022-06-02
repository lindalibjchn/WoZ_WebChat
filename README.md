# The real-time HAI Chat Application

The real-time chat application is a web application for online interaction between agent/avatar and participants that we developed to execute the entire experiment process, including user enrolment, communication, all survey, and user consent steps. Furthermore, this application is implemented to enable full data recording of both the avatar and the participant’s audio, text, and camera stream.

As for the tech architecture of this web application, the front-end is developed by ReactJS which is an open-source JavaScript library for UI (User Interface) components; the NodeJS and Socket.IO that are back-end API services as a web server for data transmission between the front-end and database; the functionality of video-call is implemented by WebRTC (Web Real-Time Communication), which is a technology to capture video media without requiring an intermediary and users do not need to install or plugin any software, it is a suitable way to implement Real-Time online communication. Finally, we chose MongoDB technology, which is a document-oriented database to store user registration information. To publish our Web application, the back-end
is deployed on the Heroku service platform, and the front-end is deployed on a cloud platform.

Webapp Link: https://rt-webchatapp-v5.netlify.app

## Bibtex: 

```
@inproceedings{li-etal-2021-detecting,
    title = "Detecting interlocutor confusion in situated human-avatar dialogue: A pilot study",
    author = "Li, Na  and Kelleher, John D. and Ross, Robert",
    booktitle = "Proceedings of the 25th Workshop on the Semantics and Pragmatics of Dialogue - Full Papers",
    month = sep,
    year = "2021",
    address = "Potsdam, Germany",
    publisher = "SEMDIAL",
    url = "http://semdial.org/anthology/Z21-Li_semdial_0013.pdf",
}
```
