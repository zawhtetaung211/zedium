import { Schema, model, models } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  provider?: string;
  provider_id?: string;
  token?: string;
  provider_pic?: string;
  followers?: string;
  following?: string;
}

const UserSchema = new Schema({
  name: String,
  email: String,
  provider: String,
  provider_id: String,
  token: String,
  provider_pic: String,
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

UserSchema.methods.follow = function (user_id: number) {
  if (this.following.indexOf(user_id) === -1) {
    this.following.push(user_id);
  }
  return this.save();
};

UserSchema.methods.addFollower = function (fs: number) {
  this.followers.push(fs);
};

const User = models.User || model('User', UserSchema);

export default User;
