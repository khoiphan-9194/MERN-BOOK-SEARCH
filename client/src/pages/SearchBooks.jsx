import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { SAVE_BOOK } from '../utils/mutations'; 
import { useMutation } from '@apollo/client';
// import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useQuery } from '@apollo/client';
import { QUERY_USER,QUERY_ME } from '../utils/queries';




const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  const[saveBook, { error }] = useMutation(SAVE_BOOK, {
    refetchQueries: Auth.loggedIn() // means if the user is logged in 
      // then we need to refetch the user data after we save the book
      // so that we can see the saved books in the saved books page
      // if the user is not logged in, we don't need to refetch the user data   
      ? [
          {
            query: QUERY_USER,
            variables: { userId: Auth.getProfile().data._id }
          }
        ]
      : []
  });
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState([]);



const { loading, data: userData } = useQuery(QUERY_USER, {
  skip: !Auth.loggedIn(), // skip the query if user is not logged in
  variables: { userId: Auth.loggedIn() ? Auth.getProfile().data._id : null },
}); // this piece of code will only run if the user is logged in
//console.log("USER DATA", userData);
// console.log("USER DATA", userData.user.savedBooks);

useEffect(() => {
  const token = Auth.getToken(); // first we need to get the token to check if the user is logged in
  if (!token) {
    return false;
  }
  if (userData) {

    setSavedBookIds(userData.user.savedBooks.map((book) => book.bookId));
    console.log("SAVED BOOK IDS", userData.user.savedBooks.map((book) => book.title));
  }
}, [userData]);



 console.log("INITIAL SAVED BOOK IDS", savedBookIds);

  
  const handleFormSubmit = async (event) => {
  event.preventDefault();
 
  if (!searchInput) {
    return false;
  }
  try {
    const response = await searchGoogleBooks(searchInput);

    if (!response.ok) {
      throw new Error('something went wrong!');
    }
    // we need to parse the response as JSON
    // because response returns a stream of data 
    // and we need to convert it to a JSON object
    const { items } = await response.json();

    const bookData = items.map((book) => ({
      bookId: book.id,
      authors: book.volumeInfo.authors || ['No author to display'],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks?.thumbnail || '',
    }));
    setSearchedBooks(bookData);
    setSearchInput('');


  } catch (err) {
    console.error(err);
  }
}

// create method to save a book to the database
const handleSaveBook = async (bookId) => {
  const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
  console.log(bookToSave.bookId);
  // if the book is not found, return false
  if (!bookToSave) {
    alert('Something went wrong!');
    return false;
  }
  const token = Auth.loggedIn() ? Auth.getToken() : null;
  console.log(token); 
  if (!token) {
    return false;
  }
  try {
    const { data } = await saveBook({
      variables: { bookInput: { ...bookToSave } },
      
    }); 
    

    console.log(data);

    if (error) {
      throw new Error('something went wrong!');
    }

    // if book successfully saves to user's account, save book id to state
     setSavedBookIds([...savedBookIds, bookToSave.bookId]);
     
    
  } catch (err) {
    console.error(err);
  }


}



  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}
                      <br />
                      bookId: {book.bookId}
                    </Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                                    {
                                      Auth.loggedIn() && (
                                        <Button
                                          disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                                          className='btn-block btn-info'
                                          onClick={() => handleSaveBook(book.bookId)}>
                                          {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                                            ? 'This book has already been saved!'
                                            : 'Save this Book!'}
                                        </Button>
              
                                      )
                                    }
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>


      

      
    </>
  );
};

export default SearchBooks;
