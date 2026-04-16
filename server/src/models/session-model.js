import { model, Schema } from "mongoose";

const sessionSchema=Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    refreshToken:{
        type:String,
        required:[true,"Please provide the refresh token"],
        unique:true
    },

    expiresAt:{
        type:Date,
        required:true,
    },
    isRevoked:{
        type:Boolean,
        default:false
    },


},{timestamps:true});

sessionSchema.index({expiresAt:1},{expireAfterSeconds:0}); // automatically will delete the expired sessions awesome feature , bg ttl check by mongodb
sessionSchema.index({userId:1});

const SessionModel=model('Session',sessionSchema);

export default SessionModel;