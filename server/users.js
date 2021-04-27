//user management
const users = [];

const addUser =({id, name, room})=> {
    //javascript mastery = javascriptmastery
    if(name != null && room.toString() != "") {
        name = name.toString().trim().toLowerCase();
    } else {
        return
    }

    if(room != null && room.toString() != "") {
        room = room.toString().trim().toLowerCase();
    } else {
        return
    }

    const exitingUser = users.find((user)=>user.room === room && user.name === name);
    if(exitingUser){
        removeUser(id)
    }

    const user = {id, name, room};
    users.push(user);
    return { user };
};

const removeUser = (id)=>{
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
};

const getUser = (id)=> users.find((user) => user.id === id);

const getUsersInRooms =(room) => users.filter((user)=>user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRooms };