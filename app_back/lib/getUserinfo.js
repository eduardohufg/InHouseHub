const { get } = require("mongoose")
const { name } = require("tar/types")

function getUserinfo(user){
    return {
        username: user.username,
        name: user.name,
        id: user.id,
    }
}

module.exports = { getUserinfo }