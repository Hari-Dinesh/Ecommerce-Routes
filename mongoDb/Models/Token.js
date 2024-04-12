
import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    Role:{
        type:String,
        enum: ['user', 'admin'],
        default:'user',
        required:true
    },
    Token: {
        type: String,
        required: true
    }
});

const Token = mongoose.model('Token', TokenSchema);

export default Token;