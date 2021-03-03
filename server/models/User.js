const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must match an email address!']
        },
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        
        //user submissions
        postSubmissions: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    }
);

userSchema.pre('save', async function(next){
    if(this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function(password){
    return bcrypt.compare(password, this.password);
}

const User = model('User', userSchema);
module.exports = User;