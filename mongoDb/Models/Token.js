
import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    Token: {
        type: String,
        required: true
    }
});

const Token = mongoose.model('Token', TokenSchema);

export default Token;