import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;
//




export const SAVE_BOOK = gql`
mutation savedBook($bookInput: bookDataInput!) {
  savedBook(bookInput: $bookInput) {
    username
    email
    savedBooks {
      title
      authors
      description
      image
      bookId
      link
    }
  }
}
`;
//





export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;



// type Mutation {
//   login(email: String!, password: String!): Auth
//   addUser(username: String!, email: String!, password: String!): Auth
//   saveBook(bookInput: BookInput!): User
//   removeBook(bookId: ID!): User
// }  