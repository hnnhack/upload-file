import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Image, Message, Header, Icon, Table } from 'semantic-ui-react';

const INITIAL_RECEIPT = {
  image: '',
};

const App = () => {
  const [receipt, setReceipt] = useState(INITIAL_RECEIPT);
  const [imagePreview, setImagePreview] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState({});

  useEffect(() => {
    const isReceipt = Object.values(receipt).every((el) => Boolean(el));
    isReceipt ? setDisabled(false) : setDisabled(true);
  }, [receipt]);

  const handleChange = (event) => {
    const { files } = event.target;
    setReceipt((prevState) => ({ ...prevState, image: files[0] }));
    console.log(receipt);
    setImagePreview(window.URL.createObjectURL(files[0]));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const API =
      'https://custom-ocr.klippa.com/api/v1/parseDocument?X-Auth-Key=Bm4CTHGza7FWYE8t6gtkGezwjcZrFrrn';
    try {
      setLoading(true);
      setError('');
      const data = new FormData();
      data.append('document', receipt.image);
      const header = new Headers();
      const response = await fetch(API, { method: 'post', body: data, headers: header });
      const result = await response.json();
      console.log(result);
      setResponse(result);
      setReceipt(INITIAL_RECEIPT);
      setImagePreview('');
      setSuccess(true);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header as="h2" block color="green">
        <Icon name="file" color="green" />
        Upload Receipt or Invoice
      </Header>
      <Form loading={loading} error={Boolean(error)} success={success} onSubmit={submitHandler}>
        <Message
          error
          header="Oops! Please check your upload presets on your Klippa account. "
          content={error}
        />
        <Message success icon="check" header="Success!" content="Your file(s) has been uploaded" />
        <Form.Field
          control={Input}
          name="image"
          type="file"
          accept="image/*"
          content="Select Image"
          onChange={handleChange}
        />
        <Image src={imagePreview} rounded centered size="small" />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
      <Header as="h2">Responsed Data from API</Header>
      <Table compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Result</Table.HeaderCell>
            <Table.HeaderCell>Request ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>{response.result}</Table.Cell>
            <Table.Cell>{response.request_id}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default App;
