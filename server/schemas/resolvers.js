const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { User } = require("../utils/auth");
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userInfo = await User
                    .findOne({ _id: context.user._id })
                    .select("-__v -password")
                    .populate("books");

                return userInfo;
            }
            throw new AuthenticationError("You are not logged in");
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Wrong login information!");
            };

            const userPW = await user.isCorrectPassword(password);
            if (!userPW) {
                throw new AuthenticationError("Wrong password input!");
            };

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { user, token };
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true },
                )
                    .populate("books");
                return updateUser;
            };
            throw new AuthenticationError("Login to save books to your library!");
        }
    },

    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true },
            );
            return updateUser;
        };
        throw new AuthenticationError("Login to delete books from your library!");
    }

};

module.exports = resolvers;
