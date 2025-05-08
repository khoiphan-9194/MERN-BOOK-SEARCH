

const {User} = require('../models');
const auth = require('../utils/auth');

const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
 Query: {
  users: async () => {
    return User.find();
  },
  user: async (parent, { userId }) => {
    return User.findById(userId);
  },
  me: async (parent, args, context) => {
    if (context.user) {
      // return User.findById(context.user._id).populate('savedBooks');
      const userData = await User.findById(context.user._id).populate('savedBooks');
      return userData;
    }
    throw new AuthenticationError('Not logged in');
  }
},

 Mutation: {
  addUser: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });
    const token = signToken(user);
    return { token, user };
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Incorrect credentials');
    }
    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }
    const token = signToken(user);
    return { token, user };
  },
  savedBook: async (parent, { bookInput }, context) => {
    if (context.user) {
     try {
   
        // If the book doesn't exist, proceed to save it
        const updatedUser = await User.findByIdAndUpdate(
          
          context.user._id,
          { $addToSet: { savedBooks: bookInput } }, // Use $addToSet to avoid duplicates
          { new: true, runValidators: true }
        );

   
   
        return updatedUser;
      }
      catch (err) {
        console.error(err);
        throw new Error('Error saving book');
      }
    }
    throw new AuthenticationError('You need to be logged in!');
  },





  deleteBook: async (parent, { bookId }, context) => {
    if (context.user) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        // we need to put bookId in {} because we are using $pull to remove the book from the array
        // and we need to specify the field that we want to remove
        { $pull: { savedBooks: { bookId } } }, // Use $pull to remove the book by bookId
        { new: true }
      );
      return updatedUser;
    }
    throw new AuthenticationError('You need to be logged in!');
  }
}

}


 module.exports = resolvers;