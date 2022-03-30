const userDefault = {
    username: '',
    attributes:{
        email: ""
    }
}

const user = (state = userDefault, action) => {
    switch(action.type) {
        case "login":
            return action.payload
        case "logout":
            return userDefault
        default:
            return state
    }
}

export default user;