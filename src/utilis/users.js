const users = []

const addUser = ({ id, userName, roomNo }) => {
    // Clean the data
    userName = userName.trim().toLowerCase()
    roomNo = roomNo.trim().toLowerCase()

    // Validate the data
    if (!userName || !roomNo) {
        return {
            error: 'userName and roomNo are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.roomNo === roomNo && user.userName === userName
    })

    // Validate userName
    if (existingUser) {
        return {
            error: 'userName is in use!'
        }
    }

    // Store user
    const user = { id, userName, roomNo }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInroom = (roomNo) => {
    roomNo = roomNo.trim().toLowerCase()
    return users.filter((user) => user.roomNo === roomNo)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInroom
}