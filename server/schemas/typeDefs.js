const typeDefs =`
type User {
  _id: ID
  username: String
  email: String
  password: String
  savedBooks: [bookSchema]!
}

type bookSchema {
  authors: [String]
  description: String
  bookId: String
  image: String
  link: String
  title: String
}

input bookDataInput {
  authors: [String]
  description: String
  bookId: String
  image: String
  link: String
  title: String
}

type Auth {

  token: ID!
  user: User
}

type Query {
  me: User
  users: [User]!
  user(userId: ID!): User
}

type Mutation {
  # create a user
  addUser(username: String!, email: String!, password: String!): Auth
  # login a user
  login(email: String!, password: String!): Auth
  # save a book, 
  savedBook(bookInput: bookDataInput!): User

  # remove a book
  deleteBook(bookId: ID!): User
}
`;
module.exports = typeDefs;
/*

# mutation type
type Mutation {
  # create a user
  addUser(username: String!, email: String!, password: String!): Auth
  # login a user
  login(email: String!, password: String!): Auth
  # save a book
  savedBook(bookId: ID!): User
  # remove a book
  deleteBook(bookId: ID!): User
}
*/