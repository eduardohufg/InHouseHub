const Mongoose = require("mongoose");
const { u } = require("tar");
const bcrypt = require('bcrypt');

const UserSchaema = new Mongoose.Schema({
    id: {
        type: Object,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchaema.pre("save", function(next){
    if(this.isModified('password') || this.isNew){
        const document = this;  

        bcrypt.hash(document.password, 10, (err, hash) => {
            if(err){
                next(err);
            }else{
                document.password = hash;
                next();
            }
        });
    }   else{
        next();
    }
});

UserSchaema.methods.usernameExists = async function(username){
    const result = await Mongoose.model("User").findOne({username});

    return !!result;

};


UserSchaema.methods.comparePassword = async function(password, hash){
    const same = await bcrypt.compare(password, hash);

    return same;
}   


module.exports = Mongoose.model('User', UserSchaema);
