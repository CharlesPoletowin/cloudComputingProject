const user = (state = {}, action) => {
    switch(action.type) {
        case "login":
            return action.payload
        case "logout":
            return {}
        default:
            return state
    }
}

export default user;