import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema=Schema({

    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minLength:[2,"Name must be atleast 2 characters in length"],
        maxLength:[50,"Name must only be 50 characters in length"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        unique:true,
        match:['/^\S+@\S+\.\S+$/',"Email is not valid"],
        index:true
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        select:false,
        minlength: [6, "Password must be at least 6 characters"]
    },
    role:{
        type:String,
        enum:["USER","ORGANIZER","ADMIN"],
        default:"USER"
    },
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE"],
        default:"ACTIVE" // INACTIVE means soft deleted 
    },


    // other extra fields for logging
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null
    }

},{
    timestamps:true,
}
);


// pre auto  hash passwords , refresh token 
userSchema.pre('save',async function (next){
    if(!this.isModified('password')) return next();

    try{

        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);

        next();

    } catch(error){
        console.log(`error in hashing passoword ->> ${error}`);
        next(error);
    }
});


// compare method 

userSchema.methods.comparePassword=async function (inputPassword){
    return await bcrypt.compare(inputPassword,this.password);
}

// static method to find all active users 
userSchema.statics.findActiveUsers=function (){
    return this.find({status:"ACTIVE"});
}



userSchema.index({email:1});
userSchema.index({status:1});

const UserModel=model('User',userSchema);