import { useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutations';


const SavedBooks = () => {
 //const [userData, setUserData] = useState({});
  // console.log("HERE IN SAVED BOOKS");
  // let checks if the user is logged in


  
  const { loading, data } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(), // skip the query if user is not logged in
  });
  const userData = data?.me || {}; //means if data is not null, then set user to data.me, otherwise set user to an empty object

   const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  useEffect(() => {
    if (data && data.me && data.me.savedBooks) {
      window.document.title = `${data.me.username}'s saved books`;
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn
    if (!token) {
      return false;
    }
    try {
      const response = await deleteBook({
        variables: { bookId },
      });
      if (!response) {
        throw new Error('something went wrong!');
      }
      console.log("BOOK DELETED", response);
      alert("Book Deleted");
    }
    catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
   
   
{/* 
we need to add userData.savedBooks first because if we don't, it will throw an error saying that userData.savedBooks is undefined.
This is because the data is not yet loaded when the component first renders. So we need to check if userData.savedBooks is defined before we try to map over it.
 */}
      <div className="text-light bg-dark p-5">
        <Container>
         
          <h2>Welcome {userData.username}!</h2>
          <h4>Viewing saved books!</h4>
        
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
        {userData.savedBooks && userData.savedBooks.map((book) => { 
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
